import { createContext, useContext, useState } from 'react';

// Create AuthContext
const AuthContext = createContext();

// Create a custom provider component
export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(null); // Initialize login state

    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for consuming the context
export const useAuth = () => useContext(AuthContext);
