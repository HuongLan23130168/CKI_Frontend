import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Protected({ children }: { children: ReactNode }) {
    const { role, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <p className="message">Đang tải...</p>;
    }

    if (role === "guest") {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
}

export default Protected;
