import "../assets/refund.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRefundRequestsByEmail } from "../services/GameService";
import type { RefundRequest } from "../types/Game";

type RefundTab = "processing" | "refunded" | "rejected";

const tabs: { value: RefundTab; label: string }[] = [
    { value: "processing", label: "Chờ xử lý" },
    { value: "refunded", label: "Đã hoàn tiền" },
    { value: "rejected", label: "Bị từ chối" },
];

function RefundRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<RefundRequest[]>([]);
    const [tab, setTab] = useState<RefundTab>("processing");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        getRefundRequestsByEmail(user.email)
            .then((data) => setRequests(data.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))))
            .catch((err) => setError(err instanceof Error ? err.message : "Có lỗi xảy ra"))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) {
        return (
            <section className="empty">
                <h1>Bạn chưa đăng nhập</h1>
                <Link to="/login" className="main-btn">Đăng nhập ngay</Link>
            </section>
        );
    }

    const visibleRequests = requests.filter((request) => {
        if (tab === "processing") return request.status === "pending" || request.status === "approved";
        return request.status === tab;
    });

    return (
        <div>
            <div className="page-crumb">
                <Link to="/">Trang chủ</Link>
                <i className="fas fa-chevron-right"></i>
                <span className="current">Yêu cầu hoàn tiền</span>
            </div>

            <h1 className="account-title">
                <i className="fas fa-rotate-left"></i> Yêu cầu hoàn tiền
            </h1>

            <div className="refund-tabs">
                {tabs.map((item) => (
                    <button
                        type="button"
                        key={item.value}
                        className={tab === item.value ? "refund-tab active" : "refund-tab"}
                        onClick={() => setTab(item.value)}
                    >
                        {item.label}
                        <span>{requests.filter((request) => item.value === "processing"
                            ? request.status === "pending" || request.status === "approved"
                            : request.status === item.value).length}</span>
                    </button>
                ))}
            </div>

            {loading && <p className="message">Đang tải yêu cầu...</p>}
            {error && <p className="message error">{error}</p>}

            {!loading && !error && visibleRequests.length === 0 && (
                <section className="empty">
                    <h2>Chưa có yêu cầu trong mục này</h2>
                    <Link to="/orders" className="main-btn">Xem đơn hàng đã mua</Link>
                </section>
            )}

            {visibleRequests.map((request) => (
                <article className="refund-request-card" key={request.id}>
                    <div className="refund-request-heading">
                        <div>
                            <strong>{request.gameName}</strong>
                            <small>Đơn hàng #{request.orderId} · {new Date(request.requestedAt).toLocaleString("vi-VN")}</small>
                        </div>
                        <span className={`refund-status refund-${request.status}`}>
                            {request.status === "pending" && "Chờ duyệt"}
                            {request.status === "approved" && "Đã duyệt, chờ hoàn tiền"}
                            {request.status === "refunded" && "Đã hoàn tiền"}
                            {request.status === "rejected" && "Bị từ chối"}
                        </span>
                    </div>
                    <p><b>Lý do:</b> {request.reason}</p>
                    <p><b>Thời gian đã chơi:</b> {request.playtimeHours} giờ</p>
                    {request.details && <p><b>Mô tả:</b> {request.details}</p>}
                    {request.status === "rejected" && request.adminNote && (
                        <p className="refund-rejection-note"><b>Lý do từ chối:</b> {request.adminNote}</p>
                    )}
                    <Link to="/orders" className="refund-order-link">Xem đơn hàng</Link>
                </article>
            ))}
        </div>
    );
}

export default RefundRequests;
