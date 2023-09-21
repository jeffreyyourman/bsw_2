// src/context/AuthContext.js

import React, { createContext, useContext, useState } from 'react';

// Create a Context for the authentication state
const AuthContext = createContext();

// The AuthProvider component will wrap the entire application and provide
// the authentication state to any component that needs it.
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState('test this shit'); // Initial state is false

    // Here you could also add logic to determine initial authentication state
    // from a token in local storage or other mechanism, for example:
    //
    // const token = localStorage.getItem('auth_token');
    // const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token));

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the authentication context
export const useAuth = () => useContext(AuthContext);
