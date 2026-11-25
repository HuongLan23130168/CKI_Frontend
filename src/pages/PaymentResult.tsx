import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../assets/payment-result.css";

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const status = searchParams.get("status");
  const orderRef = searchParams.get("order");

  useEffect(() => {
    if (status === "success") clearCart();
  }, [clearCart, status]);

  if (status === "success") {
    return (
      <section className="success">
        <h1>Thanh toán thành công</h1>
        <p>VNPay đã xác nhận thanh toán đơn hàng của bạn.</p>
        {orderRef && <p>Mã giao dịch: {orderRef}</p>}
        <div className="payment-result-actions">
          <Link className="main-btn" to="/orders">Xem đơn mua</Link>
          <Link className="main-btn" to="/games">Tiếp tục mua game</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="empty">
      <h1>{status === "invalid" ? "Không xác thực được giao dịch" : "Thanh toán chưa thành công"}</h1>
      <p>Giỏ hàng của bạn vẫn được giữ lại. Bạn có thể thử thanh toán lại.</p>
      <Link className="main-btn" to="/checkout">Quay lại thanh toán</Link>
    </section>
  );
}

export default PaymentResult;
