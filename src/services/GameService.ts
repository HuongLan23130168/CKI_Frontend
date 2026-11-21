import type { Game, Order, Review, NewReview, Comment, NewComment, Voucher, OrderRecord, RefundRequest, NewRefundRequest } from "../types/Game";
export const API_URL = "http://localhost:3000";
export async function getGames(): Promise<Game[]> {
    const response = await fetch(`${API_URL}/games`);

    if (!response.ok) {
        throw new Error("Không thể lấy danh sách game");
    }

    return response.json();
}
export async function getGameById(id: string): Promise<Game> {
    const response = await fetch(`${API_URL}/games/${id}`);

    if (!response.ok) {
        throw new Error("Không tìm thấy game");
    }

    return response.json();
}
export async function createOrder(order: Order) {
    const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    });

    if (!response.ok) {
        throw new Error("Không thể tạo đơn hàng");
    }

    return response.json();
}
export async function getReviews(gameId: string): Promise<Review[]> {
    const response = await fetch(`${API_URL}/reviews?gameId=${gameId}`);

    if (!response.ok) {
        throw new Error("Không thể lấy đánh giá");
    }

    return response.json();
}
export async function createReview(review: NewReview): Promise<Review> {
    const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
    });

    if (!response.ok) {
        throw new Error("Không thể gửi đánh giá");
    }

    return response.json();
}
export async function getComments(gameId: string): Promise<Comment[]> {
    const response = await fetch(`${API_URL}/comments?gameId=${gameId}`);

    if (!response.ok) {
        throw new Error("Không thể lấy bình luận");
    }

    return response.json();
}
export async function createComment(comment: NewComment): Promise<Comment> {
    const response = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
    });

    if (!response.ok) {
        throw new Error("Không thể gửi bình luận");
    }

    return response.json();
}
export async function getVouchers(): Promise<Voucher[]> {
    const response = await fetch(`${API_URL}/vouchers`);

    if (!response.ok) {
        throw new Error("Không thể lấy danh sách voucher");
    }

    return response.json();
}
export async function getOrdersByEmail(email: string): Promise<OrderRecord[]> {
    const response = await fetch(`${API_URL}/orders?email=${encodeURIComponent(email)}`);

    if (!response.ok) {
        throw new Error("Không thể lấy danh sách đơn hàng");
    }

    return response.json();
}

export async function getRefundRequestsByEmail(email: string): Promise<RefundRequest[]> {
    const response = await fetch(`${API_URL}/refundRequests?email=${encodeURIComponent(email)}`);

    if (!response.ok) {
        throw new Error("Không thể lấy danh sách yêu cầu hoàn tiền");
    }

    return response.json();
}

export async function createRefundRequest(request: NewRefundRequest): Promise<RefundRequest> {
    const response = await fetch(`${API_URL}/refundRequests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error("Không thể gửi yêu cầu hoàn tiền");
    }

    return response.json();
}
