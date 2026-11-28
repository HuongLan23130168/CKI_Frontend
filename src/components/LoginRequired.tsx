import "../assets/base.css";
import { Link, useLocation } from "react-router-dom";

function LoginRequired({ message }: { message: string }) {
    const location = useLocation();

    return (
        <div className="login-required">
            <i className="fas fa-lock"></i>

            <p>
                {message}{" "}
                <Link to="/login" state={{ from: location.pathname }}>
                    Đăng nhập
                </Link>{" "}
                hoặc <Link to="/register">đăng ký</Link> để tiếp tục.
            </p>
        </div>
    );
}

export default LoginRequired;
