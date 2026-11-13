import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import '../assets/css/Header.css'

const CATEGORIES = [
  { id: 'steam', name: 'Game Steam' },
  { id: 'online', name: 'Game Online' },
  { id: 'xbox', name: 'Xbox Game Pass' },
  { id: 'full', name: 'Full thông tin' },
  { id: 'combo', name: 'Combo tiết kiệm' },
  { id: 'wallet', name: 'Thẻ nạp & Steam Wallet' },
]

const TOP_TAGS = [
  { id: 1, label: 'Game Steam', filter: 'steam' },
  { id: 2, label: 'Game Online', filter: 'online' },
  { id: 3, label: 'Xbox Game Pass', filter: 'xbox' },
  { id: 4, label: 'Full TT', filter: 'full' },
  { id: 5, label: 'Combo', filter: 'combo' },
]

function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCategory, setShowCategory] = useState(false)
  const navigate = useNavigate()

  const cartCount = 2

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate('/games?search=' + encodeURIComponent(searchTerm.trim()))
    }
  }

  return (
    <header className="header">
      <div className="header-top">
        <Link to="/" className="header-logo">
          <span className="header-logo-name">
            <span className="header-logo-green">TEDI</span> SHOP
          </span>
          <span className="header-logo-sub">Game Bản Quyền</span>
        </Link>

        <form className="header-search" onSubmit={handleSearch}>
          <input
            className="header-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập nội dung cần tìm..."
          />
          <button className="header-search-button" type="submit">
            Tìm
          </button>
        </form>

        <div className="header-actions">
          <Link to="/auth" className="header-btn">
            Đăng nhập
          </Link>
          <Link to="/cart" className="header-btn">
            <ShoppingCart size={18} color="#34d399" />
            {cartCount > 0 && <span className="header-cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      <div className="header-bottom">
        <div className="header-bottom-inner">
          <div className="header-category">
            <button
              className="header-category-button"
              onClick={() => setShowCategory(!showCategory)}
            >
              Danh mục {showCategory ? '▲' : '▼'}
            </button>

            {showCategory && (
              <div className="header-dropdown">
                <div className="header-dropdown-title">Thể loại game & Tài khoản</div>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={'/games?category=' + cat.id}
                    className="header-dropdown-item"
                    onClick={() => setShowCategory(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <nav className="header-tags">
            {TOP_TAGS.map((tag) => (
              <Link
                key={tag.id}
                to={'/games?category=' + tag.filter}
                className="header-tag"
              >
                {tag.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header