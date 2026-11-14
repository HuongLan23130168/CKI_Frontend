import "../assets/footer.css";
import { Link } from "react-router-dom";

const SHOP_LINKS = [
    { id: 1, name: "Tất cả sản phẩm", to: "/games" },
    { id: 2, name: "Sản phẩm mới", to: "/games?sort=newest" },
    { id: 3, name: "Sản phẩm bán chạy", to: "/games?sort=popular" },
    { id: 4, name: "Game đang giảm giá", to: "/games?sale=1" },
    { id: 5, name: "Game đánh giá cao", to: "/games?sort=rating" },
];

const SUPPORT_LINKS = [
    { id: 1, name: "Giới thiệu về cửa hàng" },
    { id: 2, name: "Liên hệ chúng tôi" },
    { id: 3, name: "Bảo hành và hoàn tiền" },
    { id: 4, name: "Chính sách bảo mật" },
    { id: 5, name: "Hướng dẫn mua hàng" },
];

const PAYMENTS = [
    { id: 1, name: "MoMo", color: "#a50064" },
    { id: 2, name: "ZaloPay", color: "#0068ff" },
    { id: 3, name: "VISA", color: "#1a1f71" },
    { id: 4, name: "MasterCard", color: "#eb001b" },
    { id: 5, name: "PayPal", color: "#003087" },
    { id: 6, name: "VietQR 24/7", color: "#059669" },
];

function Footer() {
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-col">
                    <Link to="/" className="footer-brand">
                        <div className="footer-brand-icon">
                            <i className="fas fa-gamepad"></i>
                        </div>
                        <div className="footer-brand-text">
                            <strong>TEDI SHOP</strong>
                            <small>Game bản quyền</small>
                        </div>
                    </Link>

                    <p className="footer-company">TEDISHOP VIỆT NAM</p>
                    <p className="footer-text">
                        Địa chỉ: 89 Nguyễn Bỉnh Khiêm, Phường 1, Gò Vấp, Hồ Chí Minh
                    </p>
                    <p className="footer-text">Hotline: 0987.654.321 (8h00 - 23h00)</p>
                    <p className="footer-text">Email: support@tedishop.vn</p>

                    <div className="footer-social">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noreferrer"
                            className="footer-btn"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://discord.com"
                            target="_blank"
                            rel="noreferrer"
                            className="footer-btn"
                        >
                            Discord
                        </a>
                    </div>
                </div>

                <div className="footer-col">
                    <h4 className="footer-title">Cửa hàng</h4>
                    {SHOP_LINKS.map((item) => (
                        <Link key={item.id} to={item.to} className="footer-link">
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="footer-col">
                    <h4 className="footer-title">Thông tin hỗ trợ</h4>
                    {SUPPORT_LINKS.map((item) => (
                        <a key={item.id} href="#" className="footer-link">
                            {item.name}
                        </a>
                    ))}
                </div>

                <div className="footer-col">
                    <h4 className="footer-title">Thanh toán</h4>

                    <div className="footer-box">
                        <div className="footer-payments">
                            {PAYMENTS.map((item) => (
                                <span
                                    key={item.id}
                                    className="footer-payment"
                                    style={{ background: item.color }}
                                >
                                    {item.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="footer-box footer-review">
                        <span className="footer-stars">★★★★★</span>
                        <span>
                            <b>4.8/5</b> • 17,782 đánh giá
                        </span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-inner">
                    <p>Copyright © Tedishop. All Rights Reserved.</p>

                    <div className="footer-bottom-right">
                        <span>Hỗ trợ kỹ thuật 24/7</span>
                        <button
                            className="footer-top-btn"
                            onClick={scrollToTop}
                            title="Lên đầu trang"
                        >
                            <i className="fas fa-chevron-up"></i>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;