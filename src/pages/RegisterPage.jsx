import "../assets/auth.css";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState("");
    const [sending, setSending] = useState(false);

    function validate() {
        const result: Record<string, string> = {};

        if (!name.trim()) {
            result.name = "Vui lòng nhập họ và tên.";
        }

        if (!email.trim()) {
            result.email = "Vui lòng nhập email.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            result.email = "Email không hợp lệ.";
        }

        if (!phone.trim()) {
            result.phone = "Vui lòng nhập số điện thoại.";
        } else if (!/^0\d{9,10}$/.test(phone.trim())) {
            result.phone = "Số điện thoại gồm 10-11 số, bắt đầu bằng 0.";
        }

        if (password.length < 6) {
            result.password = "Mật khẩu phải có ít nhất 6 ký tự.";
        }

        if (confirm !== password) {
            result.confirm = "Mật khẩu xác nhận không khớp.";
        }

        return result;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitError("");

        const result = validate();
        setErrors(result);

        if (Object.keys(result).length > 0) {
            return;
        }

        setSending(true);

        try {
            await register({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                password,
            });

            navigate("/");
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <div className="auth-icon">
                        <i className="fas fa-user-plus"></i>
                    </div>

                    <h1 className="auth-title">TẠO TÀI KHOẢN MỚI</h1>

                    <div className="register-gift">
                        <i className="fas fa-gift"></i>
                        <span>Tặng 50.000đ vào ví khi đăng ký thành công!</span>
                    </div>
                </div>

                <div className="auth-content">
                    <button
                        type="button"
                        className="auth-google-button"
                        onClick={() => setSubmitError("Đăng ký bằng Google chưa được hỗ trợ.")}
                    >
                        <i className="fab fa-google"></i>
                        <span>Đăng ký nhanh bằng Google</span>
                    </button>

                    <div className="auth-divider">
                        <span></span>
                        <p>HOẶC ĐIỀN THÔNG TIN</p>
                        <span></span>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="auth-input-group">
                            <label className="auth-label">Họ và tên</label>
                            <div className="auth-input-wrapper">
                                <i className="fas fa-user auth-input-icon"></i>
                                <input
                                    className="auth-input"
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            {errors.name && <p className="auth-field-error">{errors.name}</p>}
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Địa chỉ Email</label>
                            <div className="auth-input-wrapper">
                                <i className="fas fa-envelope auth-input-icon"></i>
                                <input
                                    className="auth-input"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {errors.email && <p className="auth-field-error">{errors.email}</p>}
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Số điện thoại</label>
                            <div className="auth-input-wrapper">
                                <i className="fas fa-phone auth-input-icon"></i>
                                <input
                                    className="auth-input"
                                    type="tel"
                                    placeholder="0987654321"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            {errors.phone && <p className="auth-field-error">{errors.phone}</p>}
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Mật khẩu (Ít nhất 6 ký tự)</label>
                            <div className="auth-input-wrapper">
                                <i className="fas fa-lock auth-input-icon"></i>
                                <input
                                    className="auth-input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {errors.password && (
                                <p className="auth-field-error">{errors.password}</p>
                            )}
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Xác nhận lại mật khẩu</label>
                            <div className="auth-input-wrapper">
                                <i className="fas fa-lock auth-input-icon"></i>
                                <input
                                    className="auth-input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                />
                            </div>
                            {errors.confirm && (
                                <p className="auth-field-error">{errors.confirm}</p>
                            )}
                        </div>

                        {submitError && <p className="auth-error">{submitError}</p>}

                        <button type="submit" className="register-button" disabled={sending}>
                            {sending ? "Đang tạo tài khoản..." : "Đăng ký nhận quà 50k vào ví"}
                        </button>
                    </form>

                    <div className="auth-link">
                        <p>
                            Đã có tài khoản My Game Store?
                            <Link to="/login">Đăng nhập ngay</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
