import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
    loginUser,
    registerUser,
    updateUser,
    changeUserPassword,
    getUserById,
    getGoogleProfile,
    loginWithGoogleProfile,
} from "../services/AuthService";
import type { AuthSession, Role, SessionUser } from "../types/User";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AUTH_KEY, createToken } from "../services/TokenService";

interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

interface AuthContextType {
    user: SessionUser | null;
    role: Role;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    loginWithGoogle: (accessToken: string) => Promise<void>;
    logout: () => void;
    updateProfile: (name: string, phone: string) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useLocalStorage<AuthSession | null>(AUTH_KEY, null);
    const [user, setUser] = useState<SessionUser | null>(null);
    const [loading, setLoading] = useState(session !== null);

    useEffect(() => {
        if (!session) {
            setUser(null);
            setLoading(false);
            return;
        }

        if (user && user.id === session.userId) {
            return;
        }

        let cancelled = false;

        getUserById(session.userId)
            .then((found) => {
                if (cancelled) return;

                if (found) {
                    setUser(toSessionUser(found));
                } else {
                    setSession(null);
                }
            })
            .catch(() => {
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [session]);

    function toSessionUser(data: SessionUser & { password?: string }): SessionUser {
        return { id: data.id, name: data.name, email: data.email, phone: data.phone };
    }

    function startSession(data: SessionUser & { password?: string }) {
        setUser(toSessionUser(data));
        setSession({ token: createToken(), userId: data.id });
    }

    async function login(email: string, password: string) {
        const found = await loginUser(email, password);
        startSession(found);
    }

    async function loginWithGoogle(accessToken: string) {
        const profile = await getGoogleProfile(accessToken);
        const found = await loginWithGoogleProfile(profile);
        startSession(found);
    }

    async function register(data: RegisterData) {
        await registerUser(data);
    }

    async function updateProfile(name: string, phone: string) {
        if (!user) return;

        const updated = await updateUser(user.id, { name, phone });
        setUser(toSessionUser(updated));
    }

    async function changePassword(currentPassword: string, newPassword: string) {
        if (!user) return;

        await changeUserPassword(user.id, currentPassword, newPassword);
    }

    function logout() {
        setUser(null);
        setSession(null);
    }

    const role: Role = user ? "user" : "guest";

    return (
        <AuthContext.Provider value={{ user, role, loading, login, register, loginWithGoogle, logout, updateProfile, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth phải được dùng bên trong AuthProvider");
    }

    return context;
}
