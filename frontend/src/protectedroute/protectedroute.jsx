import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { User_Auth } from "../endpoints/api";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const CheckAuth = async () => {
            const authStatus = await User_Auth();
            setIsAuthenticated(authStatus)
        };
        CheckAuth();
    },[]);

    if (isAuthenticated === null) {
        return <p>Loading...</p>
    }

    return isAuthenticated ? <Outlet/> : <Navigate to="/login"/>;
};

export default ProtectedRoute;