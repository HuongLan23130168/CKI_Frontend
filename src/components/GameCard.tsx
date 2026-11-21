import "../assets/game-card.css";
import { Link } from "react-router-dom";
import type { Game } from "../types/Game";
import { getFinalPrice, formatPrice } from "../utils/price";

interface GameCardProps {
    game: Game;
}

function GameCard({ game }: GameCardProps) {
    return (
        <Link to={`/games/${game.id}`} className="product-card">
            <div className="product-img">
                <img src={game.image} alt={game.name} />

                <div className="badge-row">
                    {game.isNew && <span className="badge badge-new">MỚI</span>}
                    {game.discount > 0 && (
                        <span className="badge badge-sale">-{game.discount}%</span>
                    )}
                </div>
            </div>

            <div className="product-body">
                <h3 className="product-title">{game.name}</h3>

                <div className="product-meta">
                    <span className="product-tag">{game.genre}</span>

                    <span className="product-sold">
                        <i className="fas fa-shopping-cart"></i> {game.sold}
                    </span>
                </div>

                <div className="product-price-row">
                    <span className="product-old">
                        {game.discount > 0 ? formatPrice(game.price) : ""}
                    </span>

                    <strong className="product-price">
                        {formatPrice(getFinalPrice(game))}
                    </strong>
                </div>
            </div>
        </Link>
    );
}

export default GameCard;
