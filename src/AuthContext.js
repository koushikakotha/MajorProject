// src/AuthContext.js

import { createContext, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { createBrowserHistory } from 'history';
const AuthContext = createContext();
const history = createBrowserHistory();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    const login = (token, role,username, password) => {
        setUser({ role,username, password });
        // Store the token in local storage or secure storage if needed
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        // Remove the token from local storage or secure storage
        localStorage.removeItem('token');
        history.push('/');
        //<Navigate to="/list" />
        return <Navigate to="/login" />;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export { AuthProvider, useAuth };
