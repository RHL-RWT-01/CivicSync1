"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
};

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<boolean>;
    signUp: (email: string, password: string, name: string) => Promise<boolean>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const api_url = process.env.NEXT_PUBLIC_SERVER_URL;

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${api_url}/auth/me`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const signIn = async (email: string, password: string): Promise<boolean> => {
        try {
            const result = await fetch(`${api_url}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!result.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await result.json();
            setUser(data);

            // Refresh user data to ensure we have the latest state
            await fetchUser();

            return true;
        } catch (error) {
            throw new Error("Failed to sign in. Please try again.");
        }
    };

    const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
        try {
            const response = await fetch(`${api_url}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, name }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                return false;
            }
            return true;
        } catch (error) {
            throw new Error("Failed to sign up. Please try again.");
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            const response = await fetch(`${api_url}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to sign out. Please try again.");
            }
            toast.success("Successfully signed out", {
                style: { background: "#1e293b", color: "#3b82f6" }, // bg-slate-800 + blue text
            });

            setUser(null);
            router.push("/");
            router.refresh();
        } catch (error) {
            throw new Error("Failed to sign out. Please try again.");
        }
    };

    const refreshUser = async (): Promise<void> => {
        await fetchUser();
    };

    const value: AuthContextType = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}