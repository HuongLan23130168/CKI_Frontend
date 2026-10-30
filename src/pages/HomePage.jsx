
import React, { useState } from 'react'
import '../assets/css/HomePage.css'

const BANNERS = [
  {
    id: 1,
    badge: 'MỚI RA MẮT',
    title: 'Game bản quyền giá rẻ',
    subtitle: 'Nhận key tự động sau 1-5 phút',
    image: 'https://picsum.photos/id/1015/1200/400',
  },
  {
    id: 2,
    badge: 'SIÊU TIẾT KIỆM',
    title: 'Xbox Game Pass Ultimate',
    subtitle: 'Chơi hơn 400 game chỉ với 80.000đ',
    image: 'https://picsum.photos/id/1043/1200/400',
  },
  {
    id: 3,
    badge: 'BÁN CHẠY',
    title: 'Steam Wallet - Nạp thẻ nhanh',
    subtitle: 'Thanh toán bằng VietQR, MoMo, Visa',
    image: 'https://picsum.photos/id/1018/1200/400',
  },
]

const SERVICES = [
  { id: 1, icon: '⏰', title: 'Giao hàng tự động', desc: 'Nhận key sau 1-5 phút' },
  { id: 2, icon: '🛡️', title: 'Bảo hành uy tín', desc: '1 đổi 1 trọn đời' },
  { id: 3, icon: '💳', title: 'Thanh toán tiện lợi', desc: 'VietQR, MoMo, Visa' },
  { id: 4, icon: '🎧', title: 'Hỗ trợ 24/7', desc: 'Kỹ thuật viên nhiệt tình' },
]

function HomePage() {
  
  const [current, setCurrent] = useState(0)

  
  const banner = BANNERS[current]

  const nextBanner = () => {
    setCurrent((current + 1) % BANNERS.length)
  }

  const prevBanner = () => {
    setCurrent((current - 1 + BANNERS.length) % BANNERS.length)
  }

  return (
    <div className="home">
      {}
      <section className="banner">
        <img className="banner-img" src={banner.image} alt={banner.title} />
        <div className="banner-overlay"></div>

        <div className="banner-content">
          <span className="banner-badge">{banner.badge}</span>
          <h2 className="banner-title">{banner.title}</h2>
          <p className="banner-subtitle">{banner.subtitle}</p>
          <a href="#" className="banner-button">
            Khám phá ngay →
          </a>
        </div>

        <button className="banner-arrow banner-arrow-left" onClick={prevBanner}>
          ‹
        </button>
        <button className="banner-arrow banner-arrow-right" onClick={nextBanner}>
          ›
        </button>

        {}
        <div className="banner-dots">
          {BANNERS.map((item, index) => (
            <span
              key={item.id}
              className={index === current ? 'dot dot-active' : 'dot'}
              onClick={() => setCurrent(index)}
            ></span>
          ))}
        </div>
      </section>

      {}
      <section className="services">
        {SERVICES.map((item) => (
          <div className="service-card" key={item.id}>
            <div className="service-icon">{item.icon}</div>
            <div>
              <h4 className="service-title">{item.title}</h4>
              <p className="service-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default HomePage
