import "../assets/product-detail.css";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { getGameById, getReviews } from "../services/GameService";
import { useCart } from "../context/CartContext";
import { getFinalPrice, formatPrice } from "../utils/price";
import ReviewSection from "../components/ReviewSection";
import CommentSection from "../components/CommentSection";
import SimilarProducts from "../components/SimilarProducts";
import Footer from "../components/Footer";
import type { Game, Review } from "../types/Game";

function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [game, setGame] = useState<Game | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);
    const [notice, setNotice] = useState("");
    const [showAllSpecs, setShowAllSpecs] = useState(false);

    // Đổi sang game khác (bấm sản phẩm tương tự) thì tải lại từ đầu
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setQuantity(1);
        setNotice("");
        setShowAllSpecs(false);
        window.scrollTo(0, 0);

        getGameById(id)
            .then((data) => setGame(data))
            .catch(() => setGame(null))
            .finally(() => setLoading(false));

        getReviews(id)
            .then((data) => setReviews(data))
            .catch(() => setReviews([]));
    }, [id]);

    if (loading) {
        return <p className="message">Đang tải...</p>;
    }

    if (!game) {
        return <p className="message">Không tìm thấy game.</p>;
    }

    const finalPrice = getFinalPrice(game);

    // Điểm hiển thị: trung bình đánh giá thật, chưa có thì lấy rating của game
    const rating =
        reviews.length === 0
            ? game.rating
            : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const specs: { label: string; value: string }[] = [];

    if (game.systemRequirements) {
        specs.push({ label: "Hệ điều hành", value: game.systemRequirements.os });
        specs.push({ label: "Bộ vi xử lý (CPU)", value: game.systemRequirements.cpu });
        specs.push({ label: "Bộ nhớ (RAM)", value: game.systemRequirements.ram });
        specs.push({ label: "Đồ họa (GPU)", value: game.systemRequirements.gpu });
        specs.push({ label: "Dung lượng ổ đĩa", value: game.systemRequirements.storage });
    }

    specs.push({ label: "Ngày phát hành", value: game.releaseDate });
    specs.push({ label: "Nền tảng", value: game.platform });
    specs.push({ label: "Thể loại", value: game.genre });

    const specOpen = showAllSpecs || specs.length <= 4;

    // Mô tả ngắn: không có highlights thì dùng description
    const highlights = game.highlights ?? [game.description];

    const handleAddToCart = () => {
        addToCart(game, quantity);
        setNotice(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
        setTimeout(() => setNotice(""), 2500);
    };

    const handleBuyNow = () => {
        addToCart(game, quantity);
        navigate("/checkout");
    };

    const goToReviews = () => {
        document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div>
            <div className="page-crumb">
                <Link to="/">
                    <i className="fas fa-house"></i> Trang chủ
                </Link>
                <i className="fas fa-chevron-right"></i>
                <Link to="/games">Game</Link>
                <i className="fas fa-chevron-right"></i>
                <Link to={`/games?genre=${encodeURIComponent(game.genre)}`}>
                    {game.genre}
                </Link>
                <i className="fas fa-chevron-right"></i>
                <span className="current">{game.name}</span>
            </div>

            <section className="card-box detail-main">
                <div className="detail-cover">
                    <img src={game.image} alt={game.name} />
                    <span className="platform-badge">{game.platform}</span>
                </div>

                <div>
                    <div className="detail-chips">
                        <button className="chip chip-blue" onClick={goToReviews}>
                            <i className="fas fa-comment-dots"></i> {reviews.length} đánh
                            giá từ khách hàng →
                        </button>

                        <span className="chip">
                            <i className="fas fa-shopping-cart"></i> {game.sold} đã bán
                        </span>

                        <span className="chip chip-green">
                            <i className="fas fa-shield-halved"></i> Chính sách bảo hành
                        </span>

                        <span className="chip chip-yellow">
                            <i className="fas fa-star"></i> Rating {rating.toFixed(2)}
                        </span>
                    </div>

                    <h1 className="detail-title">{game.name}</h1>

                    <div className="price-line">
                        {game.discount > 0 && (
                            <span className="price-old">{formatPrice(game.price)}</span>
                        )}

                        <strong className="price-now">{formatPrice(finalPrice)}</strong>

                        {game.discount > 0 && (
                            <span className="save-badge">Tiết kiệm {game.discount}%</span>
                        )}
                    </div>

                    <div className="qty-row">
                        <span>Số lượng:</span>

                        <div className="qty-box">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                -
                            </button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>

                    <div className="buy-row">
                        <button className="btn-cart" onClick={handleAddToCart}>
                            <i className="fas fa-cart-plus"></i> Thêm vào giỏ hàng
                        </button>

                        <button className="btn-buy" onClick={handleBuyNow}>
                            <i className="fas fa-bolt"></i> Mua ngay
                        </button>
                    </div>

                    {notice && <p className="notice">{notice}</p>}
                </div>
            </section>

            <div className="info-row">
                <div className="info-box info-green">
                    <div className="info-icon">
                        <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                        <small>Giao hàng</small>
                        <strong>Gửi mã game về email của khách hàng</strong>
                    </div>
                </div>

                <div className="info-box info-green">
                    <div className="info-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div>
                        <small>Thời gian giao hàng</small>
                        <strong>1-5 phút sau khi thanh toán</strong>
                    </div>
                </div>

                <div className="info-box info-blue">
                    <div className="info-icon">
                        <i className="fas fa-shield-halved"></i>
                    </div>
                    <div>
                        <small>Bảo hành</small>
                        <strong>24/7 trọn đời theo chính sách</strong>
                    </div>
                </div>
            </div>

            <section className="card-box">
                <h2>Mô tả ngắn sản phẩm</h2>

                <ul className="check-list">
                    {highlights.map((text) => (
                        <li key={text}>
                            <i className="far fa-circle-check"></i>
                            {text}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="card-box">
                <h2>Chi tiết về sản phẩm &amp; cốt truyện</h2>

                <p className="detail-text">{game.description}</p>

                <div className={specOpen ? "spec-box open" : "spec-box"}>
                    <p className="spec-title">
                        {game.systemRequirements
                            ? "Cấu hình yêu cầu (System Requirements):"
                            : "Thông tin thêm:"}
                    </p>

                    <div className="spec-grid">
                        {specs.map((item) => (
                            <div key={item.label}>
                                <b>{item.label}:</b> {item.value}
                            </div>
                        ))}
                    </div>
                </div>

                {specs.length > 4 && (
                    <button
                        className="show-more"
                        onClick={() => setShowAllSpecs(!showAllSpecs)}
                    >
                        {showAllSpecs ? "Thu gọn" : "Xem thêm"}{" "}
                        <i
                            className={
                                showAllSpecs ? "fas fa-chevron-up" : "fas fa-chevron-down"
                            }
                        ></i>
                    </button>
                )}
            </section>

            <ReviewSection
                gameId={game.id}
                gameName={game.name}
                reviews={reviews}
                onCreated={(review) => setReviews([...reviews, review])}
            />

            <CommentSection gameId={game.id} />

            <SimilarProducts game={game} />

            <Footer />
        </div>
    );
}

export default ProductDetail;