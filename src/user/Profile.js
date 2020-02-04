import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import { getUser } from "./apiUser";
import { isAuthenticated } from "../auth";
import DefaultProfileImg from "../images/avatar.png";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: ""
        };
    }

    initProfile = userId => {
        const token = isAuthenticated().token;
        getUser(userId, token).then(data => {
            if (data.error) {
                this.setState({ redirectToSignin: true });
            } else {
                let following = this.isFollowing(data);
                this.setState({ user: data, following });
            }
        });
    };

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.initProfile(userId);
    };

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.initProfile(userId);
    };

    // check if user is in the follower's list
    isFollowing = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            // one id has many other ids (followers) and vice versa
            return follower._id === jwt.user._id;
        });
        return match;
    };

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id).then(data => {
          if (data.error) {
            this.setState({ error: data.error });
          } else {
            this.setState({ user: data, following: !this.state.following });
          }
        });
      };
    

    render() {
        const { redirectToSignin, user } = this.state;
        if (redirectToSignin) return <Redirect to="/signin" />;

        // use new Date() to update image right away
        const photoUrl = user._id
            ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`
            : DefaultProfileImg;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile</h2>
                <div className="row">
                    <div className="col-md-6">
                        <img
                            style={{ height: "200px", width: "auto" }}
                            className="img-thumbnail"
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultProfileImg}`)}
                            alt={user.name}
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="lead mt-2">
                            <p>Hello {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>{`Joined ${new Date(
                                user.createdDate
                            ).toDateString()}`}</p>
                        </div>

                        {isAuthenticated().user &&
                            isAuthenticated().user._id === user._id ? (
                                <div className="d-inline-block">
                                    <Link
                                        className="btn btn-raised btn-success mr-5"
                                        to={`/user/edit/${user._id}`}
                                    >
                                        Edit Profile
                                </Link>
                                    <DeleteUser userId={user._id} />
                                </div>
                            ) : (
                                <FollowProfileButton
                                    following={this.state.following}
                                    onButtonClick={this.clickFollowButton}
                                />
                            )}
                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 mt-5 mb-5">
                        <hr />
                        <p className="lead">{user.about}</p>
                        <hr />
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
