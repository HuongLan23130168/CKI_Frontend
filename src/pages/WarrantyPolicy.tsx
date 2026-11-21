import "../assets/policy.css";

function WarrantyPolicy() {
  return (
    <article className="policy-page">
      <header className="policy-heading">
        <span>TEDI SHOP</span>
        <h1>Chính sách bảo hành và hỗ trợ</h1>
        <p>Hướng dẫn khi sản phẩm game bạn mua gặp vấn đề.</p>
      </header>

      <section className="policy-section">
        <h2>1. Phạm vi hỗ trợ</h2>
        <p>Tedi Shop tiếp nhận hỗ trợ với các vấn đề liên quan đến đơn hàng và sản phẩm số đã mua, như chưa nhận được sản phẩm, thông tin sản phẩm không đúng đơn hàng hoặc lỗi kích hoạt.</p>
      </section>

      <section className="policy-section">
        <h2>2. Cách gửi yêu cầu</h2>
        <p>Đăng nhập tài khoản, mở mục “Đơn hàng đã mua”, chọn game gặp vấn đề và gửi yêu cầu hỗ trợ hoặc hoàn tiền. Vui lòng ghi rõ tình trạng và cung cấp ảnh chụp lỗi nếu có.</p>
        <p>Yêu cầu trong vòng 14 ngày từ khi mua và dưới 2 giờ chơi được ưu tiên xem xét theo chính sách tham khảo của Tedi Shop. Yêu cầu ngoài thời hạn này vẫn có thể gửi để shop kiểm tra thủ công.</p>
      </section>

      <section className="policy-section">
        <h2>3. Quy trình xử lý</h2>
        <p>Shop kiểm tra trạng thái thanh toán, đơn hàng và thông tin bạn gửi. Tùy từng trường hợp, shop sẽ hướng dẫn khắc phục, hỗ trợ sản phẩm thay thế hoặc thông báo kết quả yêu cầu hoàn tiền.</p>
        <p>Gửi yêu cầu không đồng nghĩa với việc yêu cầu đã được chấp thuận hoặc tiền đã được hoàn. Trạng thái được cập nhật trong mục “Yêu cầu hoàn tiền”.</p>
      </section>

      <section className="policy-section">
        <h2>4. Liên hệ hỗ trợ</h2>
        <p>Email: support@tedishop.vn</p>
        <p>Hotline: 0987.654.321</p>
        <p>Thời gian hỗ trợ: 8:00 - 23:00 mỗi ngày.</p>
      </section>
    </article>
  );
}

export default WarrantyPolicy;
