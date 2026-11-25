import { useState } from "react";
import type { FormEvent } from "react";
import "../assets/contact-page.css";

function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <div className="contact-page">
      <div className="contact-heading">
        <span className="contact-tag">TEDI SHOP LUÔN SẴN SÀNG HỖ TRỢ</span>
        <h1>Liên hệ với chúng tôi</h1>
        <p>Gửi câu hỏi cho Tedi Shop, đội ngũ hỗ trợ sẽ liên hệ lại với bạn sớm nhất.</p>
      </div>
      <div className="contact-layout">
        <div className="contact-info">
          <h2>Thông tin liên hệ</h2>
          <div className="contact-item"><span className="contact-symbol">⌖</span><div><strong>Địa chỉ</strong><p>89 Nguyễn Bỉnh Khiêm, TP. Hồ Chí Minh</p></div></div>
          <div className="contact-item"><span className="contact-symbol">☎</span><div><strong>Hotline</strong><p>0987.654.321</p></div></div>
          <div className="contact-item"><span className="contact-symbol">✉</span><div><strong>Email</strong><p>support@tedishop.vn</p></div></div>
          <div className="contact-item"><span className="contact-symbol">◷</span><div><strong>Thời gian hỗ trợ</strong><p>8:00 - 23:00, tất cả các ngày trong tuần</p></div></div>
        </div>
        <div className="contact-form-box">
          <h2>Gửi tin nhắn</h2>
          {sent && <div className="contact-success">Cảm ơn bạn! Tin nhắn đã được ghi nhận.</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="contact-name">Họ và tên</label>
            <input id="contact-name" type="text" placeholder="Nguyễn Văn A" required />
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" type="email" placeholder="email@example.com" required />
            <label htmlFor="contact-message">Nội dung cần hỗ trợ</label>
            <textarea id="contact-message" rows={5} placeholder="Nhập nội dung tin nhắn của bạn" required />
            <button type="submit">Gửi tin nhắn</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
