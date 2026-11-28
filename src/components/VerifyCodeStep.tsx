import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { MAX_ATTEMPTS, RESEND_SECONDS } from "../services/VerifyService";
import type { Verification } from "../services/VerifyService";

interface VerifyCodeStepProps {
    email: string;
    verification: Verification;
    buttonLabel: string;
    onResend: () => Promise<void>;
    onVerified: () => void;
    onBack: () => void;
}

function VerifyCodeStep({
    email,
    verification,
    buttonLabel,
    onResend,
    onVerified,
    onBack,
}: VerifyCodeStepProps) {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [cooldown, setCooldown] = useState(RESEND_SECONDS);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        setInput("");
        setError("");
        setAttempts(0);
        setCooldown(RESEND_SECONDS);
    }, [verification]);

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);

        return () => clearTimeout(timer);
    }, [cooldown]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (attempts >= MAX_ATTEMPTS) {
            setError("Bạn đã nhập sai quá nhiều lần, vui lòng gửi lại mã mới.");
            return;
        }

        if (Date.now() > verification.expiresAt) {
            setError("Mã đã hết hạn, vui lòng gửi lại mã mới.");
            return;
        }

        if (input.length !== 6) {
            setError("Vui lòng nhập đủ 6 chữ số.");
            return;
        }

        if (input !== verification.code) {
            const used = attempts + 1;
            setAttempts(used);
            setError(`Mã không đúng. Bạn còn ${MAX_ATTEMPTS - used} lần thử.`);
            return;
        }

        onVerified();
    }

    async function handleResend() {
        setResending(true);
        setError("");

        try {
            await onResend();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setResending(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <p className="code-hint">
                Chúng tôi đã gửi mã xác thực gồm 6 chữ số tới <b>{email}</b>. Mã có hiệu lực
                5 phút.
            </p>

            <div className="auth-input-group">
                <label className="auth-label">Mã xác thực</label>

                <div className="auth-input-wrapper">
                    <i className="fas fa-shield-halved auth-input-icon"></i>
                    <input
                        className="auth-input code-input"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="••••••"
                        value={input}
                        onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
                    />
                </div>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="register-button">
                {buttonLabel}
            </button>

            <div className="code-actions">
                <button type="button" onClick={onBack}>
                    <i className="fas fa-arrow-left"></i> Quay lại
                </button>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || resending}
                >
                    {resending
                        ? "Đang gửi..."
                        : cooldown > 0
                          ? `Gửi lại mã sau ${cooldown}s`
                          : "Gửi lại mã"}
                </button>
            </div>
        </form>
    );
}

export default VerifyCodeStep;
