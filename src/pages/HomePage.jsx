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
  { id: 1, title: 'Giao hàng tự động', desc: 'Nhận key sau 1-5 phút' },
  { id: 2, title: 'Bảo hành uy tín', desc: '1 đổi 1 trọn đời' },
  { id: 3, title: 'Thanh toán tiện lợi', desc: 'VietQR, MoMo, Visa' },
  { id: 4, title: 'Hỗ trợ 24/7', desc: 'Kỹ thuật viên nhiệt tình' },
]

const PRODUCTS = [
  { id: 1, name: 'Xbox Game Pass Ultimate 3 tháng', price: 80000, sold: 1520, tag: 'HOT', image: 'https://picsum.photos/id/1011/400/300', isFeatured: true, isNew: false },
  { id: 2, name: 'Steam Wallet 200K', price: 205000, sold: 980, tag: 'HOT', image: 'https://picsum.photos/id/1025/400/300', isFeatured: true, isNew: false },
  { id: 3, name: 'Elden Ring Steam Key', price: 650000, sold: 430, tag: '-20%', image: 'https://picsum.photos/id/1035/400/300', isFeatured: true, isNew: false },
  { id: 4, name: 'FC 25 Standard Edition', price: 590000, sold: 760, tag: 'HOT', image: 'https://picsum.photos/id/1040/400/300', isFeatured: true, isNew: false },
  { id: 5, name: 'Black Myth: Wukong', price: 780000, sold: 210, tag: 'MỚI', image: 'https://picsum.photos/id/1050/400/300', isFeatured: false, isNew: true },
  { id: 6, name: 'Palworld Steam Key', price: 320000, sold: 150, tag: 'MỚI', image: 'https://picsum.photos/id/1056/400/300', isFeatured: false, isNew: true },
  { id: 7, name: 'Cyberpunk 2077 Ultimate', price: 450000, sold: 95, tag: 'MỚI', image: 'https://picsum.photos/id/1062/400/300', isFeatured: false, isNew: true },
  { id: 8, name: 'Hogwarts Legacy', price: 520000, sold: 70, tag: 'MỚI', image: 'https://picsum.photos/id/1069/400/300', isFeatured: false, isNew: true },
]

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + 'đ'
}

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-img-box">
        <img className="product-img" src={product.image} alt={product.name} />
        <span className="product-tag">{product.tag}</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-sold">Đã bán {product.sold}</p>
        <p className="product-price">{formatPrice(product.price)}</p>
      </div>
    </div>
  )
}

function HomePage() {
  const [current, setCurrent] = useState(0)

  const banner = BANNERS[current]

  const nextBanner = () => {
    setCurrent((current + 1) % BANNERS.length)
  }

  const prevBanner = () => {
    setCurrent((current - 1 + BANNERS.length) % BANNERS.length)
  }

  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured)
  const newProducts = PRODUCTS.filter((p) => p.isNew)

  return (
    <div className="home">
      <section className="banner">
        <img className="banner-img" src={banner.image} alt={banner.title} />
        <div className="banner-overlay"></div>

        <div className="banner-content">
          <span className="banner-badge">{banner.badge}</span>
          <h2 className="banner-title">{banner.title}</h2>
          <p className="banner-subtitle">{banner.subtitle}</p>
          <a href="#" className="banner-button">
            Khám phá ngay
          </a>
        </div>

        <button className="banner-arrow banner-arrow-left" onClick={prevBanner}>
          ‹
        </button>
        <button className="banner-arrow banner-arrow-right" onClick={nextBanner}>
          ›
        </button>

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

      <section className="services">
        {SERVICES.map((item) => (
          <div className="service-card" key={item.id}>
            <h4 className="service-title">{item.title}</h4>
            <p className="service-desc">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Sản phẩm nổi bật</h2>
          <a href="#" className="section-link">Xem tất cả</a>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Sản phẩm mới</h2>
          <a href="#" className="section-link">Xem tất cả</a>
        </div>
        <div className="product-grid">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
