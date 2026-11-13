import "../assets/auth.css";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!email.trim() || !password) {
            setError("Vui lòng nhập email và mật khẩu.");
            return;
        }

        setSending(true);
        setError("");

        try {
            await login(email, password);
            navigate("/"); 
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <div className="auth-icon">
                        <i className="fas fa-right-to-bracket"></i>
                    </div>

                    <h1 className="auth-title">ĐĂNG NHẬP TÀI KHOẢN</h1>

                    <p className="auth-description">
                        Chào mừng bạn quay trở lại với My Game Store!
                    </p>
                </div>

                <div className="auth-content">
                    <button
                        type="button"
                        className="auth-google-button"
                        onClick={() => setError("Đăng nhập bằng Google chưa được hỗ trợ.")}
                    >
                        <i className="fab fa-google"></i>
                        <span>Đăng nhập nhanh bằng Google</span>
                    </button>

                    <div className="auth-divider">
                        <span></span>
                        <p>HOẶC DÙNG EMAIL</p>
                        <span></span>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="auth-input-group">
                            <label className="auth-label">Địa chỉ Email</label>

                            <div className="auth-input-wrapper">
                                <i className="fas fa-envelope auth-input-icon"></i>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="auth-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="auth-input-group">
                            <div className="password-label">
                                <label className="auth-label">Mật khẩu</label>
                                <Link to="/forgot-password">Quên mật khẩu?</Link>
                            </div>

                            <div className="auth-input-wrapper">
                                <i className="fas fa-lock auth-input-icon"></i>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="auth-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="auth-error">{error}</p>}

                        <button type="submit" className="login-button" disabled={sending}>
                            {sending ? "Đang đăng nhập..." : "Đăng nhập ngay"}
                        </button>
                    </form>

                    <div className="auth-link">
                        <p>
                            Chưa có tài khoản My Game Store?
                            <Link to="/register">Đăng ký ngay</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
