import "@fortawesome/fontawesome-free/css/all.min.css";
import "../assets/css/AuthPage.css";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-icon">
            <i className="fas fa-sign-in-alt"></i>
          </div>

          <h1 className="auth-title">ĐĂNG NHẬP TÀI KHOẢN</h1>

          <p className="auth-description">
            Chào mừng bạn quay trở lại với Tedi Shop!
          </p>
        </div>

        <div className="auth-content">
          <button type="button" className="auth-google-button">
            <i className="fab fa-google"></i>
            <span>Đăng nhập nhanh bằng Google</span>
          </button>

          <div className="auth-divider">
            <span></span>
            <p>HOẶC DÙNG EMAIL</p>
            <span></span>
          </div>

          <form>
            <div className="auth-input-group">
              <label className="auth-label">Địa chỉ Email</label>

              <div className="auth-input-wrapper">
                <i className="fas fa-envelope auth-input-icon"></i>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="auth-input"
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
                />
              </div>
            </div>

            <button type="submit" className="login-button">
              Đăng nhập ngay
            </button>
          </form>

          <div className="auth-link">
            <p>
              Chưa có tài khoản Tedi Shop?
              <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
