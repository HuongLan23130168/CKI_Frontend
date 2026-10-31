import "@fortawesome/fontawesome-free/css/all.min.css";
import "../assets/css/AuthPage.css";
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-icon">
            <i className="fas fa-user-plus"></i>
          </div>

          <h1 className="auth-title">TẠO TÀI KHOẢN MỚI</h1>

          <div className="register-gift">
            <i className="fas fa-sparkles"></i>
            <span>Tặng 50.000đ vào ví khi đăng ký thành công!</span>
          </div>
        </div>

        <div className="auth-content">
          <button type="button" className="auth-google-button">
            <i className="fab fa-google"></i>
            <span>Đăng ký nhanh bằng Google</span>
          </button>

          <div className="auth-divider">
            <span></span>
            <p>HOẶC ĐIỀN THÔNG TIN</p>
            <span></span>
          </div>

          <form>
            <div className="auth-input-group">
              <label className="auth-label">Họ và tên</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-user auth-input-icon"></i>
                <input type="text" placeholder="Nguyễn Văn A" required />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Địa chỉ Email</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-envelope auth-input-icon"></i>
                <input type="email" placeholder="email@example.com" required />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Số điện thoại</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-phone auth-input-icon"></i>
                <input type="tel" placeholder="0987654321" required />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Mật khẩu (Ít nhất 6 ký tự)</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-lock auth-input-icon"></i>
                <input
                  type="password"
                  placeholder="••••••••"
                  minLength="6"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Xác nhận lại mật khẩu</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-lock auth-input-icon"></i>
                <input type="password" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" className="register-button">
              Đăng ký nhận quà 50k vào ví
            </button>
          </form>

          <div className="auth-link">
            <p>
              Đã có tài khoản Tedi Shop?
              <Link to="/login">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
