import "../assets/products.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

import GameCard from "../components/GameCard";
import { getGames } from "../services/GameService";
import { setGames, setLoading } from "../store/slice/GameSlice";
import type { RootState, AppDispatch } from "../store/Store";
import { getFinalPrice } from "../utils/price";
import { getPageNumbers } from "../utils/pagination";


const PRODUCTS_PER_PAGE = 12;

const priceOptions = [
    { value: "all", label: "Tất cả mức giá" },
    { value: "under100", label: "Dưới 100.000 đ" },
    { value: "100to500", label: "Từ 100.000 đ - 500.000 đ" },
    { value: "500to1000", label: "Từ 500.000 đ - 1.000.000 đ" },
    { value: "over1000", label: "Trên 1.000.000 đ" },
];

function matchPrice(finalPrice: number, range: string): boolean {
    if (range === "under100") return finalPrice < 100000;
    if (range === "100to500") return finalPrice >= 100000 && finalPrice <= 500000;
    if (range === "500to1000") return finalPrice > 500000 && finalPrice <= 1000000;
    if (range === "over1000") return finalPrice > 1000000;
    return true;
}

function Products() {
    const dispatch = useDispatch<AppDispatch>();
    const games = useSelector((state: RootState) => state.games.list);
    const loading = useSelector((state: RootState) => state.games.loading);

    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("search") ?? "";
    const genre = searchParams.get("genre") ?? "all";

    const onSale = searchParams.get("sale") === "1";
    const sort = searchParams.get("sort") ?? "popular";

    const [price, setPrice] = useState("all");
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(setLoading(true));

        getGames()
            .then((data) => dispatch(setGames(data)))
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
            })
            .finally(() => dispatch(setLoading(false)));
    }, [dispatch]);

    function updateParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams);

        if (value === "" || value === "all") {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        setSearchParams(params, { replace: true });
    }

    useEffect(() => {
        setPage(1);
    }, [keyword, genre, onSale, sort]);

    const filteredGames = games.filter((game) => {
        const matchKeyword = game.name
            .toLowerCase()
            .includes(keyword.toLowerCase());

        const matchGenre = genre === "all" || game.genre === genre;
        const matchSale = !onSale || game.discount > 0;

        return (
            matchKeyword &&
            matchGenre &&
            matchSale &&
            matchPrice(getFinalPrice(game), price)
        );
    });

    return (
        <section>
            <div className="shop-banner">
                <div>
                    <h1>Tất cả sản phẩm</h1>

                    <div className="breadcrumb">
                        <Link to="/">
                            <i className="fas fa-house"></i> Trang chủ
                        </Link>
                        <i className="fas fa-chevron-right"></i>
                        <span>Game</span>
                        <i className="fas fa-chevron-right"></i>
                        <span className="current">Tất cả sản phẩm</span>
                    </div>
                </div>

                <div className="sort-box">
                    <label>Sắp xếp</label>

                    <select value={sort} onChange={(e) => changeSort(e.target.value)}>
                        <option value="popular">Sắp xếp theo mức độ phổ biến</option>
                        <option value="newest">Mới nhất</option>
                        <option value="discount">Giảm giá nhiều nhất</option>
                        <option value="rating">Đánh giá cao</option>
                        <option value="lowToHigh">Giá: thấp đến cao</option>
                        <option value="highToLow">Giá: cao đến thấp</option>
                    </select>
                </div>
            </div>

            <div className="shop-layout">
                <aside>
                    <div className="sidebar-box">
                        <h3 className="green-line">Danh mục sản phẩm</h3>

                        <input
                            className="sidebar-search"
                            type="text"
                            placeholder="Tìm tên game..."
                            value={keyword}
                            onChange={(e) => changeKeyword(e.target.value)}
                        />

                        <ul className="category-list">
                            <li>
                                <button
                                    className={genre === "all" ? "active" : ""}
                                    onClick={() => changeGenre("all")}
                                >
                                    Tất cả sản phẩm <span>({games.length})</span>
                                </button>
                            </li>

                            {genres.map((name) => (
                                <li key={name}>
                                    <button
                                        className={genre === name ? "active" : ""}
                                        onClick={() => changeGenre(name)}
                                    >
                                        {name}{" "}
                                        <span>
                                            ({games.filter((g) => g.genre === name).length})
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="sidebar-box">
                        <h3>
                            <i className="fas fa-sliders"></i> Khoảng giá (VNĐ)
                        </h3>

                        <div className="price-options">
                            {priceOptions.map((option) => (
                                <label key={option.value}>
                                    <input
                                        type="radio"
                                        name="price"
                                        checked={price === option.value}
                                        onChange={() => changePrice(option.value)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <div>
                    {onSale && (
                        <div className="filter-chip">
                            <i className="fas fa-percent"></i> Đang lọc: game giảm giá
                            <button onClick={clearSale} aria-label="Bỏ lọc giảm giá">
                                <i className="fas fa-xmark"></i>
                            </button>
                        </div>
                    )}

                    <div className="shop-grid">
                        {currentGames.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>

                    {sortedGames.length === 0 && (
                        <p className="message">Không tìm thấy game phù hợp.</p>
                    )}


                </div>
            </div>
        </section>
    );
}

export default Products;