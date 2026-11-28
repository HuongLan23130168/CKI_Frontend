import "../assets/cart.css";
import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { getVouchers } from "../services/GameService";
import { getFinalPrice, formatPrice } from "../utils/price";
import type { Voucher } from "../types/Game";

function Cart() {
    const {
        cart,
        removeFromCart,
        changeQuantity,
        clearCart,
        subtotal,
        discount,
        total,
        voucher,
        applyVoucher,
        removeVoucher,
    } = useCart();

    const { data: vouchers } = useFetch<Voucher[]>(() => getVouchers(), [], []);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState({ text: "", ok: true });

    function tryApply(item: Voucher) {
        if (subtotal < item.minOrder) {
            setMessage({
                text: `Đơn hàng cần từ ${formatPrice(item.minOrder)} để dùng mã ${item.code}.`,
                ok: false,
            });
            return;
        }

        applyVoucher(item);
        setCode("");
        setMessage({ text: `Đã áp dụng mã ${item.code}.`, ok: true });
    }

    function handleApplyCode() {
        const found = vouchers.find(
            (item) => item.code === code.trim().toUpperCase(),
        );

        if (!found) {
            setMessage({ text: "Mã ưu đãi không tồn tại.", ok: false });
            return;
        }

        tryApply(found);
    }

    const crumb = (
        <div className="page-crumb">
            <Link to="/">
                <i className="fas fa-house"></i> Trang chủ
            </Link>
            <i className="fas fa-chevron-right"></i>
            <span className="current">Giỏ hàng của bạn</span>
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

            <h1 className="cart-title">
                <i className="fa-solid fa-bag-shopping"></i> Giỏ hàng của bạn ({cart.length} món)
            </h1>

            <div className="cart-layout">
                <div>
                    <div className="cart-box">
                        <div className="cart-box-head">
                            <span>Sản phẩm</span>

                            <button className="clear-all" onClick={clearCart}>
                                Xóa tất cả
                            </button>
                        </div>

                        {cart.map((item) => {
                            const price = getFinalPrice(item);

                            return (
                                <div className="cart-row" key={item.id}>
                                    <img src={item.image} alt={item.name} />

                                    <div className="cart-row-info">
                                        <Link to={`/games/${item.id}`}>{item.name}</Link>

                                        <div className="cart-row-meta">
                                            <span className="cart-tag">{item.genre}</span>
                                            <span>Đơn giá: {formatPrice(price)}</span>
                                        </div>
                                    </div>

                                    <div className="cart-qty">
                                        <button
                                            onClick={() => changeQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() => changeQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <strong className="cart-row-total">
                                        {formatPrice(price * item.quantity)}
                                    </strong>

                                    <button
                                        className="trash-btn"
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label="Xóa sản phẩm"
                                    >
                                        <i className="far fa-trash-can"></i>
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <Link to="/games" className="continue-link">
                        <i className="fas fa-arrow-left"></i> Mua thêm sản phẩm khác
                    </Link>
                </div>

                <aside>
                    <div className="side-box">
                        <h3>
                            <i className="fas fa-ticket"></i> Mã ưu đãi / Voucher
                        </h3>

                        <div className="voucher-input">
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Nhập mã ưu đãi..."
                            />

                            <button onClick={handleApplyCode}>Áp dụng</button>
                        </div>

                        {message.text && (
                            <p className={message.ok ? "voucher-msg ok" : "voucher-msg bad"}>
                                {message.text}
                            </p>
                        )}

                        {voucher && (
                            <div className="voucher-applied">
                                <span>
                                    Đang áp dụng: <b>{voucher.code}</b>
                                </span>

                                <button onClick={removeVoucher}>
                                    <i className="fas fa-xmark"></i>
                                </button>
                            </div>
                        )}

                        {vouchers.length > 0 && (
                            <div className="voucher-list">
                                <p className="voucher-title">Voucher khả dụng:</p>

                                {vouchers.map((item) => {
                                    const enough = subtotal >= item.minOrder;

                                    return (
                                        <div className="voucher-item" key={item.id}>
                                            <div>
                                                <span className="voucher-code">{item.code}</span>

                                                <p>
                                                    Giảm {formatPrice(item.discount)} cho đơn từ{" "}
                                                    {formatPrice(item.minOrder)}
                                                </p>
                                            </div>

                                            <button
                                                className={enough ? "use-now" : "use-now off"}
                                                onClick={() => tryApply(item)}
                                            >
                                                {enough ? "Dùng ngay" : "Chưa đủ ĐK"}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="side-box">
                        <h3>Thông tin giỏ hàng</h3>

                        <div className="sum-row">
                            <span>Tạm tính:</span>
                            <strong>{formatPrice(subtotal)}</strong>
                        </div>

                        {discount > 0 && voucher && (
                            <div className="sum-row">
                                <span>Giảm giá ({voucher.code}):</span>
                                <strong className="red">-{formatPrice(discount)}</strong>
                            </div>
                        )}

                        <div className="sum-row">
                            <span>Phí giao hàng:</span>
                            <strong className="green">Miễn phí (Qua Email)</strong>
                        </div>

                        <div className="sum-total">
                            <span>Tổng thanh toán:</span>
                            <strong>{formatPrice(total)}</strong>
                        </div>

                        <Link to="/checkout" className="checkout-btn">
                            Tiến hành thanh toán <i className="fas fa-arrow-right"></i>
                        </Link>

                        <p className="secure-note">
                            <i className="fas fa-shield-halved"></i> Bảo mật thanh toán &amp;
                            Giao dịch an toàn 100%
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Cart;
