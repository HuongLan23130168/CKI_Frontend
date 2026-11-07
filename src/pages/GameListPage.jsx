import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/GameListPage.css";

const priceRanges = [
  { id: "all", label: "Tất cả mức giá", min: 0, max: 999999999 },
  { id: "1", label: "Dưới 50.000 đ", min: 0, max: 50000 },
  { id: "2", label: "Từ 50.000 đ - 100.000 đ", min: 50000, max: 100000 },
  { id: "3", label: "Từ 100.000 đ - 200.000 đ", min: 100000, max: 200000 },
  { id: "4", label: "Trên 200.000 đ", min: 200000, max: 999999999 },
];

const gamesPerPage = 12;

function formatPrice(price) {
  if (!price) return "";
  return price.toLocaleString("vi-VN") + " đ";
}

function GameListPage({ games = [], categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);

  const priceRange = priceRanges.find((item) => item.id === selectedPrice);

  const filteredGames = games.filter((game) => {
    const isRightCategory =
      selectedCategory === "all" || game.category === selectedCategory;
    const isRightPrice =
      game.price >= priceRange.min && game.price <= priceRange.max;

    return isRightCategory && isRightPrice;
  });

  const sortedGames = [...filteredGames];

  if (sortBy === "popular") {
    sortedGames.sort((a, b) => b.sold - a.sold);
  } else if (sortBy === "price-asc") {
    sortedGames.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    sortedGames.sort((a, b) => b.price - a.price);
  }

  const totalPages = Math.ceil(sortedGames.length / gamesPerPage);
  const start = (currentPage - 1) * gamesPerPage;
  const gamesOnPage = sortedGames.slice(start, start + gamesPerPage);

  function handleSelectCategory(id) {
    setSelectedCategory(id);
    setCurrentPage(1);
  }

  function handleSelectPrice(id) {
    setSelectedPrice(id);
    setCurrentPage(1);
  }

  return (
    <div className="game-page">
      <div className="game-banner">
        <div className="game-banner-inner">
          <div className="banner-content">
            <h1>Tất cả sản phẩm</h1>
            <div className="breadcrumb">
              <Link to="/">Trang chủ</Link>
              <span>&gt;</span>
              <Link to="/games">Game</Link>
              <span>&gt;</span>
              <span className="breadcrumb-current">Tất cả sản phẩm</span>
            </div>
          </div>

          <div className="game-sort">
            <span>Sắp xếp:</span>
            <div className="game-sort-select">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Sắp xếp theo mức độ phổ biến</option>
                <option value="price-asc">Giá từ thấp đến cao</option>
                <option value="price-desc">Giá từ cao đến thấp</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="game-content">
        <aside className="game-filter">
          <div className="filter-box">
            <h3 className="filter-title">Danh mục sản phẩm</h3>

            <div className="filter-list">
              <button
                className={
                  selectedCategory === "all"
                    ? "filter-item active"
                    : "filter-item"
                }
                onClick={() => handleSelectCategory("all")}
              >
                <span>Tất cả sản phẩm</span>
                <span className="filter-count">({games.length})</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={
                    selectedCategory === cat.id
                      ? "filter-item active"
                      : "filter-item"
                  }
                  onClick={() => handleSelectCategory(cat.id)}
                >
                  <span>{cat.name}</span>
                  <span className="filter-count">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-box">
            <h3 className="filter-title-price">Khoảng giá (VNĐ)</h3>

            {priceRanges.map((range) => (
              <label key={range.id} className="filter-radio">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === range.id}
                  onChange={() => handleSelectPrice(range.id)}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        </aside>

        <main className="game-main">
          {gamesOnPage.length === 0 ? (
            <div className="game-empty">
              <p>Không tìm thấy sản phẩm nào.</p>
            </div>
          ) : (
            <div className="game-list">
              {gamesOnPage.map((game) => (
                <Link
                  to={"/games/" + game.slug}
                  className="game-card"
                  key={game.id}
                >
                  <div className="game-image">
                    <img src={game.image} alt={game.name} />

                    <div className="game-badges">
                      {game.isNew && (
                        <span className="badge badge-new">MỚI</span>
                      )}
                      {game.discount > 0 && (
                        <span className="badge badge-discount">
                          -{game.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="game-info">
                    <h3 className="game-name">{game.name}</h3>

                    <div className="game-meta">
                      <span className="game-label">GAME</span>
                      <span className="game-sold">🛒 {game.sold}</span>
                    </div>

                    <div className="game-bottom">
                      <span className="game-old-price">
                        {formatPrice(game.oldPrice)}
                      </span>
                      <span className="game-price">
                        {formatPrice(game.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="game-pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                « Trước
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Sau »
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default GameListPage;
