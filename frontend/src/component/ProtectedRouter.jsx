
import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import main from "../../main";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '/constant.js';
import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../pages/AuthContext';

function ProtectedRouter({ children }) {
    const { isLogin, setIsLogin } = useAuth();
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        //   
        try {
            const res = await main.post("/token/refresh/", {
                refresh: refreshToken
            });

            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsLogin(true);
            }
            else setIsLogin(false);
        }
        catch (err) {
            console.log(err);
            setIsLogin(false);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                await refreshToken();
            }
            setIsLogin(true);
            return children;
        }
        else {
            console.log("no token");
            setIsLogin(false);
            return <Navigate to="/login" />;
        }
    }
    useEffect(() => {
        auth().catch((err) => setIsLogin(false));
    }, []);
    if (isLogin === true) {
        return children;
    }
    if (isLogin === null) {
        return <div>Loading...</div>;
    }
    return <Navigate to="/login" />;
}

export default ProtectedRouter;