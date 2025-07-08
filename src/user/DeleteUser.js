import React, { Component } from "react";
import { Navigate } from "react-router-dom";

import { isAuthenticated } from "../auth";
import { removeUser } from "./apiUser";
import { signout } from "../auth";

class DeleteUser extends Component {
    state = {
        redirect: false
    };

    deleteAccount = () => {
        const token = isAuthenticated().token;
        const userId = this.props.userId;
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
                this.setState({ redirect: true });
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm(
            "Are you sure you want to delete your account?"
        );
        if (answer) {
            this.deleteAccount();
        }
    };

    render() {
        if (this.state.redirect) {
            return <Navigate to="/" />;
        }
        return (
            <button
                onClick={this.deleteConfirmed}
                className="btn btn-danger"
            >
                Delete Profile
            </button>
        );
    }
}

export default DeleteUser;
