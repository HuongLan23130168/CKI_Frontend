import { createServer } from "node:http";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envFile = resolve(process.cwd(), ".env");

if (existsSync(envFile)) {
    for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (match && !process.env[match[1]]) {
            process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
        }
    }
}

const port = Number(process.env.PAYMENT_SERVER_PORT || 3001);
const apiUrl = process.env.JSON_SERVER_URL || "http://localhost:3000";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const paymentUrl = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

function getSecretConfig() {
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const hashSecret = process.env.VNPAY_HASH_SECRET;

    if (!tmnCode || !hashSecret) {
        throw new Error("Vui lòng cấu hình VNPAY_TMN_CODE và VNPAY_HASH_SECRET trong file .env.");
    }

    return { tmnCode, hashSecret };
}

function getClientIp(request) {
    const forwardedFor = request.headers["x-forwarded-for"];
    return (forwardedFor ? String(forwardedFor).split(",")[0].trim() : request.socket.remoteAddress || "127.0.0.1").replace(/^::ffff:/, "");
}

function formatDate(date) {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}${values.month}${values.day}${values.hour}${values.minute}${values.second}`;
}

function sortedParams(params) {
    return Object.keys(params).sort().reduce((result, key) => {
        result[key] = params[key];
        return result;
    }, {});
}

function buildQuery(params) {
    return new URLSearchParams(sortedParams(params)).toString();
}

function makeHash(value, secret) {
    return createHmac("sha512", secret).update(value, "utf8").digest("hex");
}

function isValidSignature(params, secret) {
    const receivedHash = params.vnp_SecureHash;
    if (!receivedHash) return false;
    const signedParams = { ...params };
    delete signedParams.vnp_SecureHash;
    delete signedParams.vnp_SecureHashType;
    const expectedHash = makeHash(buildQuery(signedParams), secret);
    const received = Buffer.from(receivedHash, "hex");
    const expected = Buffer.from(expectedHash, "hex");
    return received.length === expected.length && timingSafeEqual(received, expected);
}

async function readBody(request) {
    let body = "";
    for await (const chunk of request) body += chunk;
    return JSON.parse(body || "{}");
}

async function updateOrder(params, status) {
    const response = await fetch(`${apiUrl}/orders?transactionRef=${encodeURIComponent(params.vnp_TxnRef)}`);
    if (!response.ok) throw new Error("Không thể tìm thấy đơn hàng.");
    const orders = await response.json();
    const order = orders[0];
    if (!order) throw new Error("Không tìm thấy đơn hàng theo mã giao dịch.");
    if (Number(params.vnp_Amount) !== Number(order.total) * 100) {
        throw new Error("Số tiền giao dịch không khớp với đơn hàng.");
    }
    const updated = await fetch(`${apiUrl}/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            paymentStatus: status,
            transactionNo: params.vnp_TransactionNo || "",
            paidAt: status === "paid" ? new Date().toISOString() : undefined,
        }),
    });
    if (!updated.ok) throw new Error("Không thể cập nhật trạng thái đơn hàng.");
    return order;
}

async function createPayment(request, response) {
    const { tmnCode, hashSecret } = getSecretConfig();
    const { order } = await readBody(request);
    const total = Number(order?.total);
    if (!order || !Number.isFinite(total) || total < 5000) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Đơn hàng phải có tổng thanh toán từ 5.000đ." }));
        return;
    }

    const txnRef = `${Date.now()}${randomBytes(3).toString("hex")}`;
    const orderResponse = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...order, paymentMethod: "vnpay", paymentStatus: "pending", transactionRef: txnRef }),
    });
    if (!orderResponse.ok) throw new Error("Không thể lưu đơn hàng.");

    const params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Amount: String(Math.round(total * 100)),
        vnp_CurrCode: "VND",
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: `Thanh toan don hang ${txnRef}`,
        vnp_OrderType: "other",
        vnp_Locale: "vn",
        vnp_ReturnUrl: process.env.VNPAY_RETURN_URL || `http://localhost:${port}/api/payment/return`,
        vnp_IpAddr: getClientIp(request),
        vnp_CreateDate: formatDate(new Date()),
    };
    const query = buildQuery(params);
    const secureHash = makeHash(query, hashSecret);
    const url = `${paymentUrl}?${query}&vnp_SecureHash=${secureHash}`;

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ paymentUrl: url }));
}

async function handleVnpayResult(request, response, isIpn) {
    const { hashSecret } = getSecretConfig();
    const params = Object.fromEntries(new URL(request.url, `http://localhost:${port}`).searchParams.entries());
    if (!isValidSignature(params, hashSecret)) {
        if (isIpn) {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ RspCode: "97", Message: "Invalid signature" }));
        } else {
            response.writeHead(302, { Location: `${frontendUrl}/payment-result?status=invalid` });
            response.end();
        }
        return;
    }

    const paid = params.vnp_ResponseCode === "00" && params.vnp_TransactionStatus === "00";
    await updateOrder(params, paid ? "paid" : "failed");
    if (isIpn) {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ RspCode: "00", Message: "Confirm Success" }));
        return;
    }
    const status = paid ? "success" : "failed";
    response.writeHead(302, { Location: `${frontendUrl}/payment-result?status=${status}&order=${encodeURIComponent(params.vnp_TxnRef)}` });
    response.end();
}

const server = createServer(async (request, response) => {
    try {
        const url = new URL(request.url, `http://localhost:${port}`);
        if (request.method === "POST" && url.pathname === "/api/payment/create") {
            await createPayment(request, response);
            return;
        }
        if (request.method === "GET" && url.pathname === "/api/payment/return") {
            await handleVnpayResult(request, response, false);
            return;
        }
        if (request.method === "GET" && url.pathname === "/api/payment/ipn") {
            await handleVnpayResult(request, response, true);
            return;
        }
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Không tìm thấy đường dẫn." }));
    } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: error instanceof Error ? error.message : "Có lỗi xảy ra." }));
    }
});

server.listen(port, () => {
    console.log(`Payment server running on http://localhost:${port}`);
});
