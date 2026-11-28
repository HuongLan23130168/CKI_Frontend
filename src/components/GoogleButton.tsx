import { useGoogleLogin } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GOOGLE_CLIENT_ID } from "../config";

interface GoogleButtonProps {
    label: string;
    onError: (message: string) => void;
}

function GoogleButton({ label, onError }: GoogleButtonProps) {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from;

    const startGoogleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                await loginWithGoogle(response.access_token);
                navigate(from ?? "/");
            } catch (err) {
                onError(err instanceof Error ? err.message : "Có lỗi xảy ra");
            }
        },
        onError: () => onError("Đăng nhập bằng Google thất bại, vui lòng thử lại."),
    });

    function handleClick() {
        if (!GOOGLE_CLIENT_ID) {
            onError("Chưa cấu hình Google Client ID (xem README.md).");
            return;
        }

        startGoogleLogin();
    }

    return (
        <button type="button" className="auth-google-button" onClick={handleClick}>
            <i className="fab fa-google"></i>
            <span>{label}</span>
        </button>
    );
}

export default GoogleButton;
