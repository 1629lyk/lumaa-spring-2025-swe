import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
    id: number;
    username: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
}

interface DecodedToken {
    id: number;
    username: string;
    exp: number;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState> (() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            try {
                const decoded: DecodedToken = jwtDecode<DecodedToken>(storedToken);
                return {
                    user: {
                        id: decoded.id,
                        username: decoded.username
                    },
                    token: storedToken
                };
            } catch {
                localStorage.removeItem("token");
            }
        }
        return {
            user: null,
            token: null
        };
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if ( authState.token ) {
            localStorage.setItem("token", authState.token);
        } else {
            localStorage.removeItem("token");
        }
        setLoading(false);
    }, [authState]);

    const login = ( token: string ) => {
        try {
            const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
            setAuthState({
                user: {
                    id: decoded.id,
                    username: decoded.username
                },
                token
            });
        } catch {
            console.error("Invalid token");
        }
    };

    const logout = () => {
        setAuthState({
            user: null,
            token: null
        });
        localStorage.removeItem("token");
    };

    return {
        user: authState.user,
        token: authState.token,
        loading,
        login,
        logout
    };
}