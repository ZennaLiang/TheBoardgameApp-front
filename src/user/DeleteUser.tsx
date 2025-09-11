import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import { isAuthenticated } from "../auth";
import { removeUser } from "./apiUser";
import { signout } from "../auth";

interface DeleteUserProps {
    userId: string;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ userId }) => {
    const [redirect, setRedirect] = useState(false);

    const deleteAccount = () => {
        const token = isAuthenticated().token;
        removeUser(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                // if user is not admin then signout
                if (!isAuthenticated().user.role === "admin") {
                    // signout user
                    signout(() => console.log("User is deleted"));
                }
                // redirect
                setRedirect(true);
            }
        });
    };

    const deleteConfirmed = () => {
        let answer = window.confirm(
            "Are you sure you want to delete your account?"
        );
        if (answer) {
            deleteAccount();
        }
    };

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <button
            onClick={deleteConfirmed}
            className="btn btn-danger"
        >
            Delete Profile
        </button>
    );
};

export default DeleteUser;
