import React, { useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { resetPasswordReq } from "../auth";

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { resetPasswordToken } = useParams<{ resetPasswordToken: string }>();

    const clickResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        resetPasswordReq({
            newPassword: newPassword,
            resetPasswordLink: resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                setError(data.error);
            } else {
                console.log(data.message);
                setMessage(data.message);
                setNewPassword("");
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        setMessage("");
        setError("");
    };

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Reset Your Password</h2>

            {message && (
                <div className="alert alert-success" role="alert">Password is successfully changed. Please{" "}
                    <Link to="/signin">Sign In</Link>.</div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert">{error}</div>
            )}
            {!message && (
                <form>
                    <div className="form-group mt-5">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Your new password"
                            value={newPassword}
                            name="newPassword"
                            onChange={handleChange}
                            autoFocus
                        />
                    </div>
                    <button type="button" onClick={clickResetPassword} className="btn btn-raised btn-danger">
                        Reset Password
                </button>
                </form>
            )}
        </div>

    );
};

export default ResetPassword;
