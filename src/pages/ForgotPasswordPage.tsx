import "../assets/auth.css";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { findUserByEmail } from "../services/AuthService";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [sending, setSending] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Vui lòng nhập email.");
            return;
        }

        setSending(true);

        try {
            const user = await findUserByEmail(email);

            if (!user) {
                setError("Email này chưa được đăng ký tài khoản.");
                return;
            }
            
            setSuccess(
                `Mã xác nhận đã được gửi tới ${user.email}.`,
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="auth-container forgot-container">
            <div className="auth-box forgot-box">
                <div className="auth-icon">
                    <i className="fas fa-key"></i>
                </div>

                <h1 className="auth-title">Khôi phục mật khẩu</h1>

                <p className="forgot-description">
                    Nhập email bạn đã đăng ký tài khoản tại My Game Store để lấy lại quyền
                    truy cập.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="auth-input-group">
                        <label className="auth-label">Địa chỉ Email tài khoản</label>

                        <div className="auth-input-wrapper">
                            <i className="far fa-envelope auth-input-icon"></i>
                            <input
                                className="auth-input"
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="auth-error">{error}</p>}
                    {success && <p className="auth-success">{success}</p>}

                    <button type="submit" className="forgot-button" disabled={sending}>
                        {sending ? "Đang kiểm tra..." : "Gửi mã xác nhận"}
                    </button>
                </form>

                <div className="forgot-login-link">
                    <Link to="/login">
                        <i className="fas fa-arrow-left"></i>
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
