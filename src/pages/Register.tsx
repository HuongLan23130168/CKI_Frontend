import "../assets/auth.css";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { findUserByEmail } from "../services/AuthService";
import { startVerification } from "../services/VerifyService";
import type { Verification } from "../services/VerifyService";
import { isStrongPassword } from "../utils/password";
import PasswordInput from "../components/PasswordInput";
import GoogleButton from "../components/GoogleButton";
import PasswordRules from "../components/PasswordRules";
import VerifyCodeStep from "../components/VerifyCodeStep";

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState<"form" | "verify">("form");
    const [verification, setVerification] = useState<Verification | null>(null);

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

        if (!isStrongPassword(password)) {
            result.password = "Mật khẩu chưa đạt đủ các điều kiện bên dưới.";
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
            const existing = await findUserByEmail(email);

            if (existing) {
                setErrors({ email: "Email này đã được đăng ký." });
                return;
            }

            setVerification(await startVerification(email.trim(), name.trim(), "register"));
            setStep("verify");
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setSending(false);
        }
    }

    async function handleResend() {
        setVerification(await startVerification(email.trim(), name.trim(), "register"));
    }

    async function handleVerified() {
        try {
            await register({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                password,
            });

            navigate("/login", {
                state: {
                    email: email.trim().toLowerCase(),
                    notice: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.",
                },
            });
        } catch (err) {
            setStep("form");
            setSubmitError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <div className="auth-icon">
                        <i className={step === "form" ? "fas fa-user-plus" : "fas fa-envelope-circle-check"}></i>
                    </div>

                    <h1 className="auth-title">
                        {step === "form" ? "TẠO TÀI KHOẢN MỚI" : "XÁC THỰC EMAIL"}
                    </h1>
                </div>

                <div className="auth-content">
                    {step === "verify" && verification ? (
                        <VerifyCodeStep
                            email={email.trim()}
                            verification={verification}
                            buttonLabel="Xác thực và tạo tài khoản"
                            onResend={handleResend}
                            onVerified={handleVerified}
                            onBack={() => setStep("form")}
                        />
                    ) : (
                        <>
                            <GoogleButton
                                label="Đăng ký nhanh bằng Google"
                                onError={setSubmitError}
                            />

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
                                    {errors.name && (
                                        <p className="auth-field-error">{errors.name}</p>
                                    )}
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
                                    {errors.email && (
                                        <p className="auth-field-error">{errors.email}</p>
                                    )}
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
                                    {errors.phone && (
                                        <p className="auth-field-error">{errors.phone}</p>
                                    )}
                                </div>

                                <div className="auth-input-group">
                                    <label className="auth-label">Mật khẩu</label>
                                    <PasswordInput value={password} onChange={setPassword} />
                                    <PasswordRules password={password} />
                                    {errors.password && (
                                        <p className="auth-field-error">{errors.password}</p>
                                    )}
                                </div>

                                <div className="auth-input-group">
                                    <label className="auth-label">Xác nhận lại mật khẩu</label>
                                    <PasswordInput value={confirm} onChange={setConfirm} />
                                    {errors.confirm && (
                                        <p className="auth-field-error">{errors.confirm}</p>
                                    )}
                                </div>

                                {submitError && <p className="auth-error">{submitError}</p>}

                                <button
                                    type="submit"
                                    className="register-button"
                                    disabled={sending}
                                >
                                    {sending ? "Đang gửi mã xác thực..." : "Đăng ký tài khoản"}
                                </button>
                            </form>

                            <div className="auth-link">
                                <p>
                                    Đã có tài khoản My Game Store?
                                    <Link to="/login">Đăng nhập ngay</Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;
