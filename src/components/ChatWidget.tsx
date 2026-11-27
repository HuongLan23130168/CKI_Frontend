import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/chat.css";

interface ChatMessage {
  id: number;
  sender: "shop" | "buyer";
  text: string;
}

function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "shop",
      text: "Xin chào! Tedi Shop có thể hỗ trợ gì cho bạn?",
    },
  ]);

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;

    const now = Date.now();
    setMessages((current) => [
      ...current,
      { id: now, sender: "buyer", text },
    ]);
    setMessage("");

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: now + 1,
          sender: "shop",
          text: "Tedi Shop đã nhận được tin nhắn. Bộ phận hỗ trợ sẽ phản hồi trong thời gian 8:00 - 23:00.",
        },
      ]);
    }, 500);
  }

  return (
    <div className="chat-widget">
      <button
        type="button"
        className="header-btn chat-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <i className="fas fa-comment-dots"></i>
        <span>Chat</span>
      </button>

      {open && (
        <section className="chat-panel">
          <div className="chat-heading">
            <div>
              <strong>Chat với Tedi Shop</strong>
              <small>Tin nhắn tự động</small>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng chat">
              <i className="fas fa-xmark"></i>
            </button>
          </div>

          <div className="chat-buyer-info">
            <div className="chat-avatar">
              {user ? user.name.charAt(0).toUpperCase() : "K"}
            </div>
            <div>
              <strong>{user?.name ?? "Khách"}</strong>
              {user ? (
                <>
                  <span>{user.email}</span>
                  <span>{user.phone || "Chưa có số điện thoại"}</span>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>Đăng nhập để dùng thông tin tài khoản</Link>
              )}
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((item) => (
              <div key={item.id} className={`chat-message ${item.sender}`}>
                {item.text}
              </div>
            ))}
          </div>

          <form className="chat-form" onSubmit={handleSend}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Nhập tin nhắn..."
              aria-label="Tin nhắn"
            />
            <button type="submit" aria-label="Gửi tin nhắn">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

export default ChatWidget;
