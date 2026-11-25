import "../assets/account.css";
import "../assets/refund.css";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    createRefundRequest,
    getOrdersByEmail,
    getRefundRequestsByEmail,
} from "../services/GameService";
import { getFinalPrice, formatPrice } from "../utils/price";
import type { OrderRecord, RefundRequest } from "../types/Game";

const refundReasons = [
    "Tôi mua nhầm game",
    "Game không chạy hoặc gặp lỗi kỹ thuật",
    "Tôi đã mua game này trước đó",
    "Tôi chưa nhận được game hoặc mã kích hoạt",
    "Lý do khác",
];

type OrderFilter = "all" | "paid" | "refundPending" | "refunded" | "rejected" | "canceled";

const orderFilters: { value: OrderFilter; label: string }[] = [
    { value: "all", label: "Tất cả" },
    { value: "paid", label: "Đã thanh toán" },
    { value: "refundPending", label: "Chờ xử lý hoàn tiền" },
    { value: "refunded", label: "Đã hoàn tiền" },
    { value: "rejected", label: "Bị từ chối" },
    { value: "canceled", label: "Đã hủy" },
];

function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<OrderRecord[]>([]);
    const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [sending, setSending] = useState(false);
    const [openForm, setOpenForm] = useState("");
    const [reason, setReason] = useState(refundReasons[0]);
    const [details, setDetails] = useState("");
    const [playtimeHours, setPlaytimeHours] = useState("0");
    const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        Promise.all([
            getOrdersByEmail(user.email),
            getRefundRequestsByEmail(user.email),
        ])
            .then(([orderData, requestData]) => {
                setOrders(orderData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
                setRefundRequests(requestData);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
            })
            .finally(() => setLoading(false));
    }, [user]);

    async function handleRefundSubmit(
        event: FormEvent<HTMLFormElement>,
        order: OrderRecord,
        gameId: number,
        gameName: string,
    ) {
        event.preventDefault();
        if (!user || sending) return;

        setSending(true);
        setSubmitError("");

        try {
            const request = await createRefundRequest({
                orderId: order.id,
                gameId,
                gameName,
                email: user.email,
                customerName: user.name,
                reason,
                details: details.trim(),
                playtimeHours: Number(playtimeHours),
                refundMethod: "original_payment",
                requestedAt: new Date().toISOString(),
                status: "pending",
            });
            setRefundRequests((current) => [request, ...current]);
            setOpenForm("");
            setReason(refundReasons[0]);
            setDetails("");
            setPlaytimeHours("0");
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Không thể gửi yêu cầu.");
        } finally {
            setSending(false);
        }
    }

    function getOrdersForFilter(filter: OrderFilter) {
        return orders.filter((order) => {
            const orderRequests = refundRequests.filter((request) => request.orderId === order.id);
            const isWaiting = order.paymentStatus === "pending";
            const isCanceled = order.paymentStatus === "failed";
            const isPaid = !isWaiting && !isCanceled;
            const hasRefundPending = orderRequests.some(
                (request) => request.status === "pending" || request.status === "approved",
            );
            const hasRefunded = orderRequests.some((request) => request.status === "refunded");
            const hasRejected = orderRequests.some((request) => request.status === "rejected");

            if (filter === "all") return true;
            if (filter === "canceled") return isCanceled;
            if (filter === "refundPending") return isPaid && hasRefundPending;
            if (filter === "refunded") return isPaid && hasRefunded;
            if (filter === "rejected") return isPaid && hasRejected;
            return isPaid && !hasRefundPending && !hasRefunded;
        });
    }

    const filteredOrders = getOrdersForFilter(orderFilter);

    if (!user) {
        return (
            <section className="empty">
                <h1>Bạn chưa đăng nhập</h1>
                <Link to="/login" className="main-btn">Đăng nhập ngay</Link>
            </section>
        );
    }

    return (
        <div>
            <div className="page-crumb">
                <Link to="/"><i className="fas fa-house"></i> Trang chủ</Link>
                <i className="fas fa-chevron-right"></i>
                <span className="current">Đơn hàng đã mua</span>
            </div>

            <h1 className="account-title">
                <i className="fas fa-box"></i> Đơn hàng đã mua
            </h1>

            {loading && <p className="message">Đang tải đơn hàng...</p>}
            {error && <p className="message error">{error}</p>}

            {!loading && !error && orders.length > 0 && (
                <div className="refund-tabs order-filter-tabs">
                    {orderFilters.map((filter) => (
                        <button
                            type="button"
                            key={filter.value}
                            className={orderFilter === filter.value ? "refund-tab active" : "refund-tab"}
                            onClick={() => setOrderFilter(filter.value)}
                        >
                            {filter.label}
                            <span>{getOrdersForFilter(filter.value).length}</span>
                        </button>
                    ))}
                </div>
            )}

            {!loading && !error && orders.length === 0 && (
                <section className="empty">
                    <h1>Bạn chưa có đơn hàng nào</h1>
                    <Link to="/games" className="main-btn">Mua game ngay</Link>
                </section>
            )}

            {!loading && !error && orders.length > 0 && filteredOrders.length === 0 && (
                <section className="empty">
                    <h2>Chưa có đơn hàng trong mục này</h2>
                </section>
            )}

            {filteredOrders.map((order) => (
                <div className="order-card" key={order.id}>
                    <div className="order-head">
                        <span>Đơn hàng <b>#{order.id}</b></span>
                        <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
                    </div>

                    {order.products.map((item) => {
                        const requestKey = `${order.id}-${item.id}`;
                        const gameRequest = refundRequests.find(
                            (request) => request.orderId === order.id && request.gameId === item.id,
                        );
                        const canRequest = order.paymentStatus !== "pending" && order.paymentStatus !== "failed";

                        return (
                            <div className="order-product-row" key={requestKey}>
                                <div className="order-item">
                                    <img src={item.image} alt={item.name} />
                                    <div>
                                        <Link to={`/games/${item.id}`}>{item.name}</Link>
                                        <small>SL: {item.quantity}</small>
                                    </div>
                                    <strong>{formatPrice(getFinalPrice(item) * item.quantity)}</strong>
                                </div>

                                <div className="refund-area">
                                    {gameRequest && gameRequest.status !== "rejected" ? (
                                        <div className={`refund-status refund-${gameRequest.status}`}>
                                            {gameRequest.status === "pending" && "Yêu cầu hoàn tiền đang chờ duyệt"}
                                            {gameRequest.status === "approved" && "Đã duyệt, đang chờ hoàn tiền"}
                                            {gameRequest.status === "refunded" && "Đã hoàn tiền"}
                                        </div>
                                    ) : openForm === requestKey ? (
                                        <form
                                            className="refund-form"
                                            onSubmit={(event) => handleRefundSubmit(event, order, item.id, item.name)}
                                        >
                                            <h3>Yêu cầu hoàn tiền: {item.name}</h3>
                                            <label htmlFor={`refund-reason-${requestKey}`}>Lý do yêu cầu</label>
                                            <select
                                                id={`refund-reason-${requestKey}`}
                                                value={reason}
                                                onChange={(event) => setReason(event.target.value)}
                                            >
                                                {refundReasons.map((option) => <option key={option}>{option}</option>)}
                                            </select>
                                            <label htmlFor={`refund-playtime-${requestKey}`}>Thời gian đã chơi (giờ)</label>
                                            <input
                                                id={`refund-playtime-${requestKey}`}
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={playtimeHours}
                                                onChange={(event) => setPlaytimeHours(event.target.value)}
                                                required
                                            />
                                            <label htmlFor={`refund-details-${requestKey}`}>Mô tả thêm</label>
                                            <textarea
                                                id={`refund-details-${requestKey}`}
                                                rows={3}
                                                value={details}
                                                onChange={(event) => setDetails(event.target.value)}
                                                placeholder="Mô tả vấn đề bạn gặp phải"
                                            />
                                            <p className="refund-note">
                                                Yêu cầu trong 14 ngày và dưới 2 giờ chơi thường được ưu tiên. Trường hợp khác vẫn có thể gửi để shop xem xét thủ công.
                                            </p>
                                            {submitError && <p className="message error">{submitError}</p>}
                                            <div className="refund-actions">
                                                <button type="submit" disabled={sending}>
                                                    {sending ? "Đang gửi..." : "Gửi yêu cầu hoàn tiền"}
                                                </button>
                                                <button type="button" className="refund-cancel" onClick={() => setOpenForm("")}>Hủy</button>
                                            </div>
                                        </form>
                                    ) : canRequest ? (
                                        <div className="refund-buttons">
                                            {gameRequest?.status === "rejected" && (
                                                <span className="refund-status refund-rejected">Yêu cầu trước đã bị từ chối</span>
                                            )}
                                            <button
                                                type="button"
                                                className="refund-open-button"
                                                onClick={() => {
                                                    setOpenForm(requestKey);
                                                    setSubmitError("");
                                                }}
                                            >
                                                Yêu cầu hoàn tiền
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="refund-status">Đơn hàng chưa thanh toán</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <div className="order-foot">
                        {order.voucherCode && order.discount ? (
                            <span>Mã {order.voucherCode}: -{formatPrice(order.discount)}</span>
                        ) : <span></span>}
                        <span>Tổng thanh toán: <strong>{formatPrice(order.total)}</strong></span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Orders;
