import "../assets/auth.css";
import { useState } from "react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

function PasswordInput({ value, onChange, placeholder = "••••••••" }: Props) {
    const [show, setShow] = useState(false);

    return (
        <div className="auth-input-wrapper">
            <i className="fas fa-lock auth-input-icon"></i>

            <input
                className="auth-input"
                type={show ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />

            <button
                type="button"
                className="eye-button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
                <i className={show ? "fas fa-eye-slash" : "fas fa-eye"}></i>
            </button>
        </div>
    );
}

export default PasswordInput;
