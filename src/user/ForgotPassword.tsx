import React, { useState } from "react";
import { forgotPasswordReq } from "../auth";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const clickForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        forgotPasswordReq(email).then(data => {
            if (data.error) {
                console.log(data.error);
                setError(data.error);
            } else {
                console.log(data.message);
                setMessage(data.message);
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setMessage("");
        setError("");
    };

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Forgot Password?</h2>

            {message && (
                <div className="alert alert-success" role="alert">{message}</div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert">{error}</div>
            )}

            <h6 className="mt-5 mb-5">Please enter your email and you will receive a link to create a new password via email. </h6>

            <form>
                <div className="form-group mt-5">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Your email address"
                        value={email}
                        name="email"
                        onChange={handleChange}
                        autoFocus
                    />
                </div>
                <button onClick={clickForgotPassword} className="btn btn-raised btn-primary" >Reset Password  </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
