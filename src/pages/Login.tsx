import "../assets/auth.css";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";
import GoogleButton from "../components/GoogleButton";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const fromState = location.state as { email?: string; notice?: string; from?: string } | null;
    const notice = fromState?.notice ?? "";

    const [email, setEmail] = useState(fromState?.email ?? "");
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
            navigate(fromState?.from ?? "/");
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
                    <GoogleButton label="Đăng nhập nhanh bằng Google" onError={setError} />

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

                            <PasswordInput value={password} onChange={setPassword} />
                        </div>

                        {notice && !error && <p className="auth-success">{notice}</p>}

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
