import "../assets/header.css";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getGames } from "../services/GameService";
import { setGames } from "../store/slice/GameSlice";
import type { AppDispatch, RootState } from "../store/Store";
import { getFinalPrice, formatPrice } from "../utils/price";

function Header() {
    const { cart } = useCart();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user, logout } = useAuth();

    const games = useSelector((state: RootState) => state.games.list);

    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggest, setShowSuggest] = useState(false);
    const [showCategory, setShowCategory] = useState(false);
    const [showUser, setShowUser] = useState(false);

    // ref dùng để biết người dùng có bấm ra ngoài hộp hay không
    const searchRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Chưa có game trong Redux thì tải về để header có dữ liệu ở mọi trang
    useEffect(() => {
        if (games.length === 0) {
            getGames()
                .then((data) => dispatch(setGames(data)))
                .catch(() => {
                    // Header lỗi thì bỏ qua, trang Products tự báo lỗi
                });
        }
    }, [dispatch, games.length]);

    // Bấm ra ngoài thì đóng các hộp thả xuống
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (searchRef.current && !searchRef.current.contains(target)) {
                setShowSuggest(false);
            }

            if (categoryRef.current && !categoryRef.current.contains(target)) {
                setShowCategory(false);
            }

            if (userRef.current && !userRef.current.contains(target)) {
                setShowUser(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Gợi ý: tối đa 5 game có tên chứa từ khóa
    const suggestions =
        searchTerm.trim() === ""
            ? []
            : games
                .filter((game) =>
                    game.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .slice(0, 5);

    // Đếm số game theo từng thể loại, rồi xếp nhiều nhất lên trước
    const genreCount: Record<string, number> = {};

    games.forEach((game) => {
        genreCount[game.genre] = (genreCount[game.genre] || 0) + 1;
    });

    const genres = Object.keys(genreCount).sort(
        (a, b) => genreCount[b] - genreCount[a],
    );

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (searchTerm.trim()) {
            setShowSuggest(false);
            navigate(`/games?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    }

    return (
        <header className="header">
            <div className="header-top">
                <Link to="/" className="brand">
                    <div className="brand-icon">
                        <i className="fas fa-gamepad"></i>
                    </div>

                    <div className="brand-text">
                        <strong>My Game Store</strong>
                        <small>Game bản quyền</small>
                    </div>
                </Link>

                <div ref={searchRef} className="header-search">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                                setShowSuggest(true);
                            }}
                            onFocus={() => setShowSuggest(true)}
                            placeholder="Nhập tên game cần tìm..."
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                className="search-clear"
                                onClick={() => setSearchTerm("")}
                            >
                                <i className="fas fa-xmark"></i>
                            </button>
                        )}

                        <button type="submit" className="search-submit">
                            <i className="fas fa-magnifying-glass"></i>
                        </button>
                    </form>

                    {showSuggest && suggestions.length > 0 && (
                        <div className="suggest-box">
                            <div className="suggest-title">
                                Gợi ý cho "{searchTerm}":
                            </div>

                            {suggestions.map((game) => (
                                <Link
                                    key={game.id}
                                    to={`/games/${game.id}`}
                                    className="suggest-item"
                                    onClick={() => setShowSuggest(false)}
                                >
                                    <img src={game.image} alt={game.name} />

                                    <div>
                                        <p>{game.name}</p>
                                        <span>{formatPrice(getFinalPrice(game))}</span>
                                    </div>
                                </Link>
                            ))}

                            <Link
                                to={`/games?search=${encodeURIComponent(searchTerm)}`}
                                className="suggest-all"
                                onClick={() => setShowSuggest(false)}
                            >
                                Xem tất cả kết quả →
                            </Link>
                        </div>
                    )}
                </div>

                <div className="header-actions">
                    {user ? (
                        <div ref={userRef} className="user-wrap">
                            <button
                                className="header-btn"
                                onClick={() => setShowUser(!showUser)}
                            >
                                <span className="user-avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                                <span className="hide-mobile user-name">{user.name}</span>
                                <i className="fas fa-chevron-down"></i>
                            </button>

                            {showUser && (
                                <div className="user-menu">
                                    <div className="user-info">
                                        <small>Đăng nhập với</small>
                                        <strong>{user.name}</strong>
                                        <span>{user.email}</span>
                                    </div>

                                    <Link
                                        to="/profile"
                                        className="user-link"
                                        onClick={() => setShowUser(false)}
                                    >
                                        <i className="fas fa-gear"></i> Thông tin tài khoản
                                    </Link>

                                    <Link
                                        to="/orders"
                                        className="user-link"
                                        onClick={() => setShowUser(false)}
                                    >
                                        <i className="fas fa-box"></i> Đơn hàng đã mua
                                    </Link>

                                    <div className="user-divider"></div>

                                    <button
                                        className="logout-btn"
                                        onClick={() => {
                                            logout();
                                            setShowUser(false);
                                            navigate("/");
                                        }}
                                    >
                                        <i className="fas fa-right-from-bracket"></i> Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="header-btn">
                            <i className="fas fa-user"></i>
                            <span className="hide-mobile">Đăng nhập</span>
                        </Link>
                    )}

                    <Link to="/cart" className="header-btn">
                        <i className="fas fa-shopping-cart"></i>
                        <span className="hide-mobile">Giỏ hàng</span>

                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                </div>
            </div>

            <div className="header-bottom">
                <div className="header-bottom-inner">
                    <div ref={categoryRef} className="category-wrap">
                        <button
                            className="cat-toggle"
                            onClick={() => setShowCategory(!showCategory)}
                        >
                            <i className="fas fa-bars"></i>
                            <span>Danh mục</span>
                            <i
                                className={
                                    showCategory
                                        ? "fas fa-chevron-up"
                                        : "fas fa-chevron-down"
                                }
                            ></i>
                        </button>

                        {showCategory && (
                            <div className="cat-menu">
                                <div className="cat-menu-inner">
                                    <div className="cat-menu-title">Thể loại game</div>

                                    <div className="cat-grid">
                                        <Link
                                            to="/games"
                                            className="cat-item"
                                            onClick={() => setShowCategory(false)}
                                        >
                                            Tất cả sản phẩm <span>{games.length}</span>
                                        </Link>

                                        {genres.map((name) => (
                                            <Link
                                                key={name}
                                                to={`/games?genre=${encodeURIComponent(name)}`}
                                                className="cat-item"
                                                onClick={() => setShowCategory(false)}
                                            >
                                                {name} <span>{genreCount[name]}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="quick-tags">
                        <Link to="/">
                            <i className="fas fa-house"></i> Trang chủ
                        </Link>

                        <Link to="/games">
                            <i className="fas fa-store"></i> Cửa hàng
                        </Link>

                        <Link to="/games?sale=1&sort=discount">
                            <i className="fas fa-percent"></i> Giảm giá
                        </Link>

                        <Link to="/games?sort=popular">
                            <i className="fas fa-fire"></i> Bán chạy
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;