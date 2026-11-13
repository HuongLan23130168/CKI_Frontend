import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/profile-page.css";

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Vui lòng nhập họ và tên.");
      return;
    }

    try {
      await updateProfile(name.trim(), phone.trim());
      setMessage("Đã lưu thông tin.");
    } catch {
      setMessage("Không thể lưu thông tin. Vui lòng thử lại.");
    }
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-login">
          <h1>Bạn chưa đăng nhập</h1>
          <Link to="/login">Đăng nhập để xem thông tin tài khoản</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="user-header">
        <div className="user-left">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="user-text">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span>Thành viên Tedi Shop</span>
          </div>
        </div>
      </div>
      <div className="profile-layout">
        <div className="sidebar">
          <div className="menu-active">♙　Thông tin &amp; Mật khẩu</div>
          <Link to="/orders" className="menu-item">▣　Đơn hàng đã mua</Link>
          <Link to="/refunds" className="menu-item">↶　Yêu cầu hoàn tiền</Link>
          <div className="menu-item">♧　Kho Voucher của tôi</div>
        </div>
        <div className="profile-main">
          <form className="content-box" onSubmit={handleSubmit}>
            <h3>CẬP NHẬT THÔNG TIN CÁ NHÂN</h3>
            <div className="input-row">
              <div className="form-group"><label htmlFor="profile-name">Họ và tên</label><input id="profile-name" type="text" value={name} onChange={(event) => setName(event.target.value)} /></div>
              <div className="form-group"><label htmlFor="profile-email">Email (Không thể thay đổi)</label><input id="profile-email" type="email" value={user.email} disabled /></div>
            </div>
            <div className="form-group phone-input"><label htmlFor="profile-phone">Số điện thoại</label><input id="profile-phone" type="text" value={phone} onChange={(event) => setPhone(event.target.value)} /></div>
            {message && <p className="profile-message">{message}</p>}
            <button className="save-button" type="submit">Lưu thay đổi</button>
          </form>
          <div className="content-box password-box">
            <h3>ĐỔI MẬT KHẨU TÀI KHOẢN</h3>
            <div className="form-group password-input">
              <label htmlFor="current-password">Mật khẩu hiện tại</label>
              <input id="current-password" type="password" placeholder="••••••••" />
            </div>
            <div className="form-group password-input">
              <label htmlFor="new-password">Mật khẩu mới</label>
              <input id="new-password" type="password" placeholder="••••••••" />
            </div>
            <button className="password-button" type="button">Đổi mật khẩu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
