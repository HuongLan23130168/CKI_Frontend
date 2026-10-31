import "@fortawesome/fontawesome-free/css/all.min.css";
import "../assets/css/AuthPage.css";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  return (
    <div className="auth-container forgot-container">
      <div className="auth-box forgot-box">
        <div className="auth-icon">
          <i className="fas fa-key"></i>
        </div>

        <h1 className="auth-title">Khôi phục mật khẩu</h1>

        <p className="forgot-description">
          Nhập email bạn đã đăng ký tài khoản tại Tedi Shop để lấy lại quyền
          truy cập.
        </p>

        <form>
          <div className="auth-input-group">
            <label className="auth-label">Địa chỉ Email tài khoản</label>

            <div className="auth-input-wrapper">
              <i className="far fa-envelope auth-input-icon"></i>
              <input type="email" placeholder="email@example.com" required />
            </div>
          </div>

          <button type="submit" className="forgot-button">
            Gửi mã xác nhận
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

export default ForgotPasswordPage;
