import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/Footer.css'

const SUPPORT_LINKS = [
  { id: 1, name: 'Giới thiệu về Tedi Shop', link: '/about' },
  { id: 2, name: 'Liên hệ chúng tôi', link: '/contact' },
  { id: 3, name: 'Bảo hành và hoàn tiền', link: '/policy#warranty' },
  { id: 4, name: 'Chính sách bảo mật', link: '/policy#privacy' },
  { id: 5, name: 'Bài viết & tin tức công nghệ', link: '/games' },
  { id: 6, name: 'Gửi yêu cầu hoàn tiền nhanh', link: '/profile?tab=refund' },
]

const HOT_LINKS = [
  { id: 1, name: 'Game Steam giá rẻ', link: '/games?category=steam' },
  { id: 2, name: 'Mua tài khoản Netflix 4K', link: '/games/netflix-premium' },
  { id: 3, name: 'Game Online bản quyền', link: '/games?category=game-online' },
  { id: 4, name: 'Key Windows 11 Pro vĩnh viễn', link: '/games/key-windows-11-pro' },
  { id: 5, name: 'Xbox Game Pass Ultimate', link: '/games/xbox-game-pass-ultimate' },
]

const PAYMENTS = [
  { id: 1, name: 'MoMo', color: '#a50064' },
  { id: 2, name: 'ZaloPay', color: '#0068ff' },
  { id: 3, name: 'VISA', color: '#1a1f71' },
  { id: 4, name: 'MasterCard', color: '#eb001b' },
  { id: 5, name: 'PayPal', color: '#003087' },
  { id: 6, name: 'VietQR 24/7', color: '#059669' },
]

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-column">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-name">
                <span className="footer-logo-green">TEDI</span> SHOP
              </span>
              <span className="footer-logo-sub">Cửa Hàng Tài Khoản Bản Quyền</span>
            </Link>

            <p className="footer-company">TEDISHOP VIỆT NAM</p>
            <p className="footer-text">Địa chỉ: 89 Nguyễn Bỉnh Khiêm, Phường 1, Gò Vấp, Hồ Chí Minh</p>
            <p className="footer-text">Hotline: 0987.654.321 (8h00 - 23h00)</p>
            <p className="footer-text">Email: support@tedishop.vn</p>

            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-btn footer-facebook">
                FACEBOOK
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="footer-social-btn footer-discord">
                DISCORD
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Thông tin hỗ trợ</h4>
            {SUPPORT_LINKS.map((item) => (
              <Link key={item.id} to={item.link} className="footer-link">
                {item.name}
              </Link>
            ))}
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Sản phẩm bán chạy</h4>
            {HOT_LINKS.map((item) => (
              <Link key={item.id} to={item.link} className="footer-link">
                • {item.name}
              </Link>
            ))}
          </div>

          <div className="footer-column">
            <div className="footer-box">
              <p className="footer-box-title">Phương thức thanh toán</p>
              <div className="footer-payments">
                {PAYMENTS.map((item) => (
                  <span
                    key={item.id}
                    className="footer-payment"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="footer-review">
              <span className="footer-stars">★★★★★</span>
              <span className="footer-review-text">
                <b>4.8/5</b> • 17,782 Reviews
              </span>
            </div>

            <span className="footer-dmca">DMCA PROTECTED</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            Copyright © Tedishop. All Rights Reserved. Powered by <span className="footer-logo-green">Tedishop.vn</span>
          </p>

          <div className="footer-bottom-right">
            <span>Hỗ trợ kỹ thuật 24/7</span>
            <button className="footer-top-btn" onClick={scrollToTop} title="Lên đầu trang">
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer