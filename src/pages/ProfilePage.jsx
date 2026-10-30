import React from "react";
import "../assets/css/ProfilePage.css";;

function ProfilePage() {
  return (
    <div className="profile-container">

      {/* Menu bên trái */}
      <div className="profile-menu">
        <h3>TÀI KHOẢN CỦA TÔI</h3>

        <div className="menu-active">
          Thông tin cá nhân
        </div>

        <div className="menu-item">
          Đơn hàng
        </div>

        <div className="menu-item">
          Hoàn tiền
        </div>

        <div className="menu-item">
          Ví
        </div>

        <div className="menu-item">
          Voucher
        </div>

        <div className="menu-logout">
          Đăng xuất
        </div>
      </div>

      {/* Form thông tin cá nhân */}
      <div className="profile-content">
        <h3>THÔNG TIN CÁ NHÂN</h3>

        <div className="form-group">
          <label>Họ và tên</label>
          <input
            type="text"
            defaultValue="Nguyễn Văn An"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            defaultValue="nguyenvanan@gmail.com"
            disabled
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            defaultValue="0987654321"
          />
        </div>

        <button className="save-button">
          Lưu thay đổi
        </button>
      </div>

    </div>
  );
}

export default ProfilePage;