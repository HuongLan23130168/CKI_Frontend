import "../assets/vouchers.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getVouchers } from "../services/GameService";
import { formatPrice } from "../utils/price";
import type { Voucher } from "../types/Game";

function MyVouchers() {
  const { user } = useAuth();
  const { subtotal, applyVoucher } = useCart();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getVouchers()
      .then(setVouchers)
      .catch((err) => setError(err instanceof Error ? err.message : "Không thể tải voucher."))
      .finally(() => setLoading(false));
  }, []);

  if (!user) {
    return (
      <section className="empty">
        <h1>Bạn chưa đăng nhập</h1>
        <Link to="/login" className="main-btn">Đăng nhập ngay</Link>
      </section>
    );
  }

  function useVoucher(voucher: Voucher) {
    applyVoucher(voucher);
    navigate("/cart");
  }

  return (
    <div>
      <div className="page-crumb">
        <Link to="/">Trang chủ</Link>
        <i className="fas fa-chevron-right"></i>
        <Link to="/profile">Thông tin tài khoản</Link>
        <i className="fas fa-chevron-right"></i>
        <span className="current">Kho Voucher của tôi</span>
      </div>

      <h1 className="account-title">
        <i className="fas fa-ticket"></i> Kho Voucher của tôi
      </h1>
      <p className="voucher-welcome">Xin chào {user.name}, đây là các voucher hiện có của shop.</p>

      {loading && <p className="message">Đang tải voucher...</p>}
      {error && <p className="message error">{error}</p>}

      {!loading && !error && vouchers.length === 0 && (
        <section className="empty"><h2>Hiện chưa có voucher nào</h2></section>
      )}

      <div className="my-vouchers-list">
        {vouchers.map((voucher) => {
          const canUse = subtotal >= voucher.minOrder;

          return (
            <article className="my-voucher-card" key={voucher.id}>
              <div className="my-voucher-symbol"><i className="fas fa-ticket"></i></div>
              <div className="my-voucher-info">
                <strong>{voucher.code}</strong>
                <span>Giảm {formatPrice(voucher.discount)}</span>
                <small>Áp dụng cho đơn từ {formatPrice(voucher.minOrder)}</small>
              </div>
              <div className="my-voucher-action">
                <span className={canUse ? "voucher-available" : "voucher-unavailable"}>
                  {canUse ? "Đủ điều kiện" : `Cần thêm ${formatPrice(voucher.minOrder - subtotal)}`}
                </span>
                <button type="button" disabled={!canUse} onClick={() => useVoucher(voucher)}>
                  Dùng ngay
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default MyVouchers;
