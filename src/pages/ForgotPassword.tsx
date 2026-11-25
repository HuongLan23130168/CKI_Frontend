import "../assets/auth.css";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { findUserByEmail, updatePassword } from "../services/AuthService";
import { startVerification } from "../services/VerifyService";
import type { Verification } from "../services/VerifyService";
import { isStrongPassword } from "../utils/password";
import PasswordInput from "../components/PasswordInput";
import PasswordRules from "../components/PasswordRules";
import VerifyCodeStep from "../components/VerifyCodeStep";

function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState<"email" | "code" | "password">("email");
    const [verification, setVerification] = useState<Verification | null>(null);
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState(0);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);

    async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

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

            setUserId(user.id);
            setUserName(user.name);
            setVerification(await startVerification(user.email, user.name, "reset"));
            setStep("code");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setSending(false);
        }
    }

    async function handleResend() {
        setVerification(await startVerification(email.trim(), userName, "reset"));
    }

    async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!isStrongPassword(password)) {
            setError("Mật khẩu chưa đạt đủ các điều kiện bên dưới.");
            return;
        }

        if (confirm !== password) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        setSending(true);

        try {
            await updatePassword(userId, password);

            navigate("/login", {
                state: {
                    email: email.trim().toLowerCase(),
                    notice: "Đổi mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.",
                },
            });
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

                {step === "email" && (
                    <>
                        <p className="forgot-description">
                            Nhập email bạn đã đăng ký tại My Game Store, chúng tôi sẽ gửi mã
                            xác thực để bạn đặt lại mật khẩu.
                        </p>

                        <form onSubmit={handleEmailSubmit} noValidate>
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

                            <button type="submit" className="forgot-button" disabled={sending}>
                                {sending ? "Đang gửi mã..." : "Gửi mã xác nhận"}
                            </button>
                        </form>
                    </>
                )}

                {step === "code" && verification && (
                    <VerifyCodeStep
                        email={email.trim()}
                        verification={verification}
                        buttonLabel="Xác nhận mã"
                        onResend={handleResend}
                        onVerified={() => setStep("password")}
                        onBack={() => setStep("email")}
                    />
                )}

                {step === "password" && (
                    <>
                        <p className="forgot-description">
                            Xác thực thành công! Hãy đặt mật khẩu mới cho tài khoản của bạn.
                        </p>

                        <form onSubmit={handlePasswordSubmit} noValidate>
                            <div className="auth-input-group">
                                <label className="auth-label">Mật khẩu mới</label>
                                <PasswordInput value={password} onChange={setPassword} />
                                <PasswordRules password={password} />
                            </div>

                            <div className="auth-input-group">
                                <label className="auth-label">Xác nhận mật khẩu mới</label>
                                <PasswordInput value={confirm} onChange={setConfirm} />
                            </div>

                            {error && <p className="auth-error">{error}</p>}

                            <button type="submit" className="forgot-button" disabled={sending}>
                                {sending ? "Đang lưu..." : "Đổi mật khẩu"}
                            </button>
                        </form>
                    </>
                )}

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
