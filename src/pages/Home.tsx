import "../assets/home.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import GameCard from "../components/GameCard";
import Footer from "../components/Footer.tsx";
import { getGames } from "../services/GameService";
import { setGames, setLoading } from "../store/slice/GameSlice";
import type { RootState, AppDispatch } from "../store/Store";

const HOME_PRODUCTS = 4;

function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const games = useSelector((state: RootState) => state.games.list);
    const loading = useSelector((state: RootState) => state.games.loading);

    const [error, setError] = useState("");

    useEffect(() => {
        dispatch(setLoading(true));

        getGames()
            .then((data) => dispatch(setGames(data)))
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
            })
            .finally(() => dispatch(setLoading(false)));
    }, [dispatch]);

    const newGames = [...games]
        .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
        .slice(0, HOME_PRODUCTS);

    const bestSellers = [...games]
        .sort((a, b) => b.sold - a.sold)
        .slice(0, HOME_PRODUCTS);

    return (
        <div>
            <section className="hero">
                <div>
                    <p className="small-title">WELCOME TO MY GAME STORE</p>
                    <h1>
                        Game bản quyền
                        <br />
                        giá tốt cho game thủ
                    </h1>
                    <p>
                        Mua game bản quyền, xem thông tin sản phẩm, thêm vào giỏ hàng và mô
                        phỏng đặt hàng ngay trên React.
                    </p>

                    <Link to="/games" className="main-btn">
                        Xem cửa hàng
                    </Link>
                </div>
            </section>

            <section className="home-section">
                <div className="home-section-header">
                    <h2 className="home-section-title">Sản phẩm mới</h2>
                    <Link to="/games?sort=newest" className="home-section-link">
                        Xem tất cả
                    </Link>
                </div>

                {loading && <p className="home-message">Đang tải sản phẩm...</p>}
                {error && <p className="home-message">{error}</p>}

                <div className="home-grid">
                    {newGames.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            </section>

            <section className="home-section">
                <div className="home-section-header">
                    <h2 className="home-section-title">Sản phẩm bán chạy</h2>
                    <Link to="/games?sort=popular" className="home-section-link">
                        Xem tất cả
                    </Link>
                </div>

                {loading && <p className="home-message">Đang tải sản phẩm...</p>}
                {error && <p className="home-message">{error}</p>}

                <div className="home-grid">
                    {bestSellers.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;