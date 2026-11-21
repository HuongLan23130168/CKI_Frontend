import type { User, NewUser } from "../types/User";
const API_URL = "http://localhost:3000";
export async function findUserByEmail(email: string): Promise<User | null> {
    const response = await fetch(
        `${API_URL}/users?email=${encodeURIComponent(email.trim().toLowerCase())}`,
    );

    if (!response.ok) {
        throw new Error("Không thể kết nối máy chủ");
    }

    const users: User[] = await response.json();

    return users[0] ?? null;
}
export async function loginUser(email: string, password: string): Promise<User> {
    const user = await findUserByEmail(email);

    if (!user || user.password !== password) {
        throw new Error("Email hoặc mật khẩu không đúng.");
    }

    return user;
}
export async function registerUser(data: NewUser): Promise<User> {
    const existing = await findUserByEmail(data.email);

    if (existing) {
        throw new Error("Email này đã được đăng ký.");
    }

    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, email: data.email.trim().toLowerCase() }),
    });

    if (!response.ok) {
        throw new Error("Không thể tạo tài khoản");
    }

    return response.json();
}
export async function updateUser(
    id: number,
    data: { name: string; email: string; phone: string },
): Promise<User> {
    const email = data.email.trim().toLowerCase();
    const existing = await findUserByEmail(email);

    if (existing && existing.id !== id) {
        throw new Error("Email này đã được sử dụng.");
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, email }),
    });

    if (!response.ok) {
        throw new Error("Không thể cập nhật thông tin");
    }

    return response.json();
}
