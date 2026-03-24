import React, { createContext, useState, useContext, useEffect } from 'react';

// Context
const AuthContext = createContext(null);

// Provider component to wrap app.
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On app load, check for a user in localstorage. Only checks for username - no token in localstorage.
    useEffect(() => {
        const savedUser = localStorage.getItem('weavium_user');
        if (savedUser) {
            setUser({username: savedUser});
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Call REST-endpoint
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
                // Tell browser to accept incoming HTTP-only cookie
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login Failed!');
            }

            const data = await response.json();

            // Save username so UI knows who is logged in
            setUser({username: data.username});
            localStorage.setItem('weavium_user', data.username);

            return {success: true};
        } catch (error) {
            console.error('Login error: ', error);
            return {success: false, erroe: error.message};
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, email, password}),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            setUser({username: data.username});
            localStorage.setItem('weavium_user', data.username);

            return {success: true};
        } catch (error) {
            console.error('Registration error:', error);
            return {success: false, error: error.message};
        }
    };

    const logout = async () => {
        // Kill the cookie
        try {
            // Tell the server to kill the cookie
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error: ', error);
        } finally {
            // Clear the UI state regardless of server response
            setUser(null);
            localStorage.removeItem('weavium_user');
            // Force a reload to clear Apollo's cache and reset the graph
            window.location.reload();
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

    // Hook so any component can easily use this context
    export const useAuth = () => {
        const context = useContext(AuthContext);
        if (!context) {
            throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
};