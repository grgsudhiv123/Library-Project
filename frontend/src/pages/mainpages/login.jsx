
import "./login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../endpoints/api.jsx";

const LogIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await LoginUser(username, password);

        if (success) {
            alert("User login successful.");
            navigate("/home");
        } else {
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
            <h1>Login</h1>
                <form onSubmit={handleLogin} method="post">
                    <label htmlFor="username">Username: </label> <br />
                    <input
                        type="text"
                        placeholder="Enter your username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password: </label>
                    <br />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="auth-actions">
                        <button type="submit">Login</button>
                        <a href="/signup">Sign up</a>
                    </div>
                </form>
                {error && <p className="auth-error">{error}</p>}
            </div>
        </div>
    );
};

export default LogIn;

