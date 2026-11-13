import React from "react";
import { Link } from "react-router-dom";

function formatPrice(price) {
  if (!price) return "";
  return price.toLocaleString("vi-VN") + " đ";
}

function GameCard({ game }) {
  return (
    <Link to={"/games/" + game.slug} className="game-card">
      <div className="game-image">
        <img src={game.image} alt={game.name} />

        <div className="game-badges">
          {game.isNew && <span className="badge badge-new">MỚI</span>}
          {game.discount > 0 && (
            <span className="badge badge-discount">-{game.discount}%</span>
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
          <span className="game-old-price">{formatPrice(game.oldPrice)}</span>
          <span className="game-price">{formatPrice(game.price)}</span>
        </div>
      </div>
    </Link>
  );
}

export default GameCard;
