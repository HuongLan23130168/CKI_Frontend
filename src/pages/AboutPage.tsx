import "../assets/about-page.css";

function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <span className="about-tag">CHÀO MỪNG ĐẾN VỚI TEDI SHOP</span>
        <h1>Mua game bản quyền dễ dàng, chơi game trọn niềm vui</h1>
        <p>Tedi Shop là sàn thương mại điện tử dành cho cộng đồng game thủ, nơi bạn có thể tìm thấy những tựa game yêu thích với mức giá hợp lý và dịch vụ hỗ trợ tận tình.</p>
      </section>
      <section className="about-content">
        <div className="about-intro">
          <h2>Về chúng tôi</h2>
          <p>Chúng tôi mong muốn giúp mọi game thủ tiếp cận game bản quyền một cách nhanh chóng và thuận tiện. Tedi Shop cung cấp nhiều sản phẩm như game, tài khoản và mã kích hoạt từ các nền tảng phổ biến.</p>
          <p>Đội ngũ của Tedi Shop luôn cố gắng cải thiện trải nghiệm mua sắm, hỗ trợ khách hàng trong quá trình lựa chọn, thanh toán và sử dụng sản phẩm.</p>
        </div>
        <div className="about-values">
          <div className="about-card"><div className="about-icon">✓</div><h3>Sản phẩm rõ ràng</h3><p>Thông tin sản phẩm được trình bày dễ hiểu để bạn chọn đúng thứ mình cần.</p></div>
          <div className="about-card"><div className="about-icon">⚡</div><h3>Mua hàng nhanh chóng</h3><p>Quy trình đặt hàng đơn giản, giúp bạn tiết kiệm thời gian mua sắm.</p></div>
          <div className="about-card"><div className="about-icon">♡</div><h3>Hỗ trợ tận tình</h3><p>Chúng tôi sẵn sàng giải đáp thắc mắc và hỗ trợ bạn khi cần.</p></div>
        </div>
        <div className="about-commitment"><h2>Mục tiêu của Tedi Shop</h2><p>Xây dựng một nơi mua sắm game trực tuyến thân thiện, đáng tin cậy và phù hợp với cộng đồng game thủ Việt Nam.</p></div>
      </section>
    </div>
  );
}

export default AboutPage;
