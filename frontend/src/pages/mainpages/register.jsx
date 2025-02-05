import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { Register_User } from "../../endpoints/api";


const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const nav = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const result = await Register_User(username, email, password);
            
            if (result && result.username) {  // Check if the response contains the expected data
                alert("User registered successfully.");
                nav('/login');
            } else {
                setError("Sign-up failed. Please try again.");
            }
        } catch (error) {
            setError("Sign-up failed. Please try again.", error);
        }
    };


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="form-container">
            <form className="sign-up-form" onSubmit={handleSignup} method="POST">
                <h2 className="form-heading">Sign up</h2>

                <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        placeholder="Enter your username"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Enter your email"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="Enter your password"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type={passwordVisible ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        placeholder="Confirm password"
                        className="form-input"
                        required
                    />
                </div>

                <div style={{ marginTop: "10px" }}>
                    <input
                        type="checkbox"
                        id="show-password"
                        onChange={togglePasswordVisibility}
                        checked={passwordVisible}
                        style={{ marginRight: "5px" }}
                    />
                    <label htmlFor="show-password">
                        {passwordVisible ? "Hide Password" : "Show Password"}
                    </label>
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button className="form-button" type="submit">Signup</button>

                <br/><br/>
                <span>Already have an account? <Link to={"/login"}>Sign in</Link></span>
            </form>
        </div>
    );
};

export default Register;
