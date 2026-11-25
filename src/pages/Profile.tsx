import "../assets/account.css";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/price";

function Profile() {
    const { user, updateProfile } = useAuth();

    const [name, setName] = useState(user?.name ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const [message, setMessage] = useState({ text: "", ok: true });
    const [sending, setSending] = useState(false);

    // Chưa đăng nhập thì mời đăng nhập
    if (!user) {
        return (
            <section className="empty">
                <h1>Bạn chưa đăng nhập</h1>

                <Link to="/login" className="main-btn">
                    Đăng nhập ngay
                </Link>
            </section>
        );
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name.trim()) {
            setMessage({ text: "Vui lòng nhập họ và tên.", ok: false });
            return;
        }

        if (!/^0\d{9,10}$/.test(phone.trim())) {
            setMessage({ text: "Số điện thoại gồm 10-11 số, bắt đầu bằng 0.", ok: false });
            return;
        }

        setSending(true);

        try {
            await updateProfile(name.trim(), user?.email ?? "", phone.trim());
            setMessage({ text: "Đã lưu thông tin.", ok: true });
        } catch (err) {
            setMessage({
                text: err instanceof Error ? err.message : "Có lỗi xảy ra",
                ok: false,
            });
        } finally {
            setSending(false);
        }
    }

    return (
        <div>
            <div className="page-crumb">
                <Link to="/">
                    <i className="fas fa-house"></i> Trang chủ
                </Link>
                <i className="fas fa-chevron-right"></i>
                <span className="current">Thông tin tài khoản</span>
            </div>

            <h1 className="account-title">
                <i className="fas fa-gear"></i> Thông tin tài khoản
            </h1>

            <div className="account-card">
                <div className="account-top">
                    <div className="account-avatar">{user.name.charAt(0).toUpperCase()}</div>

                    <div>
                        <strong>{user.name}</strong>
                        <p>Số dư ví: {formatPrice(user.walletBalance)}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="account-field">
                        <label>Họ và tên</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="account-field">
                        <label>Email (không thể đổi)</label>
                        <input value={user.email} disabled />
                    </div>

                    <div className="account-field">
                        <label>Số điện thoại</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>

                    {message.text && (
                        <p className={message.ok ? "account-msg ok" : "account-msg bad"}>
                            {message.text}
                        </p>
                    )}

                    <button className="main-btn" type="submit" disabled={sending}>
                        {sending ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
