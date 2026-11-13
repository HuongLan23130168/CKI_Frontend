import "../assets/form.css";
import "../assets/checkout.css";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getFinalPrice, formatPrice } from "../utils/price";
import type { Order } from "../types/Game";
const paymentMethods = [
    {
        value: "vnpay",
        icon: "fa-qrcode",
        title: "Chuyển khoản VNPAY",
        desc: "Thanh toán nhanh qua cổng VNPAY bằng mã QR hoặc thẻ ngân hàng nội địa",
        badge: "",
    },
];

function Checkout() {
    const { cart, subtotal, discount, total, voucher } = useCart();
    const { user } = useAuth();
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const [note, setNote] = useState("");
    const [payment, setPayment] = useState("vnpay");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState("");
    const [sending, setSending] = useState(false);
    function validate() {
        const result: Record<string, string> = {};

        if (!name.trim()) {
            result.name = "Vui lòng nhập họ và tên.";
        }

        if (!email.trim()) {
            result.email = "Vui lòng nhập email.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            result.email = "Email không hợp lệ.";
        }

        if (!phone.trim()) {
            result.phone = "Vui lòng nhập số điện thoại.";
        } else if (!/^0\d{9,10}$/.test(phone.trim())) {
            result.phone = "Số điện thoại gồm 10-11 số, bắt đầu bằng 0.";
        }

        return result;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitError("");

        const result = validate();
        setErrors(result);

        if (Object.keys(result).length > 0) {
            return;
        }

        const order: Order = {
            customerName: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            note: note.trim(),
            paymentMethod: payment,
            products: cart,
            total: total,
            voucherCode: discount > 0 ? voucher?.code : undefined,
            discount: discount,
            createdAt: new Date().toISOString(),
        };

        setSending(true);

        try {
            const response = await fetch("/api/payment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order }),
            });
            const responseText = await response.text();
            let result: { paymentUrl?: string; message?: string };

            try {
                result = JSON.parse(responseText);
            } catch {
                throw new Error("Không nhận được phản hồi từ máy chủ thanh toán. Hãy chạy npm run payment và kiểm tra cấu hình .env.");
            }

            if (!response.ok) {
                throw new Error(result.message || "Không thể tạo giao dịch thanh toán.");
            }

            if (!result.paymentUrl) {
                throw new Error("Máy chủ chưa tạo được liên kết thanh toán VNPay.");
            }

            window.location.assign(result.paymentUrl);
        } catch (error) {
            setSubmitError(
                error instanceof TypeError
                    ? "Không kết nối được máy chủ thanh toán. Hãy chạy npm run payment trong một terminal riêng."
                    : error instanceof Error
                      ? error.message
                      : "Có lỗi xảy ra",
            );
        } finally {
            setSending(false);
        }
    }

    const crumb = (
        <div className="page-crumb">
            <Link to="/">
                <i className="fas fa-house"></i> Trang chủ
            </Link>
            <i className="fas fa-chevron-right"></i>
            <Link to="/cart">Giỏ hàng</Link>
            <i className="fas fa-chevron-right"></i>
            <span className="current">Thanh toán đơn hàng</span>
        </div>
    );
    if (cart.length === 0) {
        return (
            <div>
                {crumb}

                <section className="empty">
                    <h1>Giỏ hàng đang trống</h1>

                    <Link to="/games" className="main-btn">
                        Mua game ngay
                    </Link>
                </section>
            </div>
        );
    }

    return (
        <div>
            {crumb}

            <h1 className="checkout-title">
                <i className="fas fa-lock"></i> Thanh toán đơn hàng
            </h1>

            <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
                
                <div>
                    <section className="co-card">
                        <h2>1. Thông tin khách hàng &amp; nhận key</h2>

                        <div className="field">
                            <label>
                                Họ và tên của bạn <span className="req">*</span>
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                            />
                            {errors.name && <p className="err">{errors.name}</p>}
                        </div>

                        <div className="field-row">
                            <div className="field">
                                <label>
                                    Email nhận tài khoản / Key <span className="req">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@gmail.com"
                                />
                                {errors.email ? (
                                    <p className="err">{errors.email}</p>
                                ) : (
                                    <p className="hint">
                                        Cửa hàng sẽ gửi thông tin tài khoản/Key vào email này
                                    </p>
                                )}
                            </div>

                            <div className="field">
                                <label>
                                    Số điện thoại Zalo <span className="req">*</span>
                                </label>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="0987654321"
                                />
                                {errors.phone ? (
                                    <p className="err">{errors.phone}</p>
                                ) : (
                                    <p className="hint">
                                        Dùng để hỗ trợ bảo hành và xác thực nhanh
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="field">
                            <label>Ghi chú đơn hàng (Tùy chọn)</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                                placeholder="Ví dụ: Cần hỗ trợ cài đặt qua Ultraview, gửi sớm giúp mình..."
                            />
                        </div>
                    </section>

                    <section className="co-card">
                        <h2>2. Phương thức thanh toán</h2>

                        {paymentMethods.map((method) => (
                            <label
                                key={method.value}
                                className={
                                    payment === method.value
                                        ? "pay-option selected"
                                        : "pay-option"
                                }
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={payment === method.value}
                                    onChange={() => setPayment(method.value)}
                                />

                                <div className="pay-text">
                                    <strong>
                                        <i className={`fas ${method.icon}`}></i> {method.title}
                                    </strong>
                                    <small>{method.desc}</small>
                                </div>

                                {method.badge && (
                                    <span className="pay-badge">{method.badge}</span>
                                )}
                            </label>
                        ))}
                    </section>
                </div>

                
                <aside>
                    <div className="co-card">
                        <h3>Thông tin đơn hàng ({cart.length} món)</h3>

                        {cart.map((item) => (
                            <div className="co-item" key={item.id}>
                                <img src={item.image} alt={item.name} />

                                <div className="co-item-info">
                                    <p>{item.name}</p>
                                    <small>SL: {item.quantity}</small>
                                </div>

                                <strong>{formatPrice(getFinalPrice(item) * item.quantity)}</strong>
                            </div>
                        ))}

                        <div className="co-sum">
                            <div>
                                <span>Tạm tính:</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>

                            {discount > 0 && voucher && (
                                <div>
                                    <span>Giảm giá ({voucher.code}):</span>
                                    <span className="red">-{formatPrice(discount)}</span>
                                </div>
                            )}

                            <div>
                                <span>Phí giao hàng:</span>
                                <span className="green">Miễn phí</span>
                            </div>
                        </div>

                        <div className="co-total">
                            <span>Tổng thanh toán:</span>
                            <strong>{formatPrice(total)}</strong>
                        </div>

                        {submitError && <p className="err">{submitError}</p>}

                        <button className="confirm-btn" type="submit" disabled={sending}>
                            <i className="far fa-circle-check"></i>{" "}
                            {sending ? "Đang xử lý..." : "Xác nhận đặt hàng ngay"}
                        </button>

                        <p className="secure-note">
                            <i className="fas fa-shield-halved"></i> Bảo hành 1 đổi 1 và hỗ
                            trợ cài đặt trọn đời
                        </p>
                    </div>

                    <Link to="/cart" className="back-cart">
                        <i className="fas fa-arrow-left"></i> Quay lại giỏ hàng
                    </Link>
                </aside>
            </form>
        </div>
    );
}

export default Checkout;
