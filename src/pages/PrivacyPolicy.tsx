import "../assets/policy.css";

function PrivacyPolicy() {
  return (
    <article className="policy-page">
      <header className="policy-heading">
        <span>TEDI SHOP</span>
        <h1>Chính sách bảo mật</h1>
        <p>Cách Tedi Shop thu thập và sử dụng thông tin khi bạn mua sắm.</p>
      </header>

      <section className="policy-section">
        <h2>1. Thông tin được sử dụng</h2>
        <p>Khi tạo tài khoản hoặc đặt hàng, shop sử dụng họ tên, email, số điện thoại, thông tin sản phẩm đã đặt và trạng thái thanh toán để phục vụ tài khoản, đơn hàng và hỗ trợ khách hàng.</p>
      </section>

      <section className="policy-section">
        <h2>2. Mục đích sử dụng</h2>
        <p>Thông tin được dùng để xử lý đơn hàng, gửi thông tin liên quan đến đơn, hỗ trợ bảo hành và hoàn tiền, bảo vệ tài khoản và phản hồi yêu cầu của bạn.</p>
      </section>

      <section className="policy-section">
        <h2>3. Thanh toán và chia sẻ thông tin</h2>
        <p>Khi thanh toán qua VNPay, bạn được chuyển đến cổng thanh toán của VNPay. Tedi Shop lưu thông tin đơn hàng và mã giao dịch cần thiết để cập nhật kết quả thanh toán. Không nhập thông tin thẻ hoặc mã OTP vào biểu mẫu của Tedi Shop.</p>
        <p>Shop chỉ chia sẻ thông tin cần thiết để xử lý giao dịch, đơn hàng hoặc yêu cầu của bạn.</p>
      </section>

      <section className="policy-section">
        <h2>4. Lưu trữ và bảo vệ thông tin</h2>
        <p>Shop giới hạn việc sử dụng thông tin vào các mục đích nêu trên và áp dụng biện pháp phù hợp để tránh truy cập hoặc sử dụng trái phép. Thông tin được lưu trong thời gian cần thiết cho tài khoản, đơn hàng và việc hỗ trợ.</p>
      </section>

      <section className="policy-section">
        <h2>5. Quyền của bạn</h2>
        <p>Bạn có thể yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân bằng cách liên hệ support@tedishop.vn. Shop sẽ xác minh yêu cầu và phản hồi theo quy định áp dụng.</p>
      </section>

      <section className="policy-section">
        <h2>6. Liên hệ về quyền riêng tư</h2>
        <p>Email: support@tedishop.vn</p>
        <p>Hotline: 0987.654.321</p>
      </section>
    </article>
  );
}

export default PrivacyPolicy;
