import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";

import { getPost, removePost, likePost, unlikePost } from "./apiPost";
import DefaultPostImg from "../images/defaultPostImg.jpg";
import { isAuthenticated } from "../auth";
import PostComments from "./PostComments";

class Post extends Component {
    state = {
        post: "",
        redirectToPosts: false,
        redirectToSignin: false,
        like: false,
        likes: 0, // total likes
        comments: []
    };

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        getPost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    post: data,
                    likes: data.likes.length,
                    like: this.isLiked(data.likes),
                    comments: data.comments
                });
            }
        });
    };

    isLiked = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlikePost : likePost;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like, // true = false vice versa for toggle
                    likes: data.likes.length
                });
            }
        });
    };

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        removePost(postId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToPosts: true });
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm(
            "Are you sure you want to delete your post?"
        );
        if (answer) {
            this.deletePost();
        }
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    renderPost = post => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";

        const { like, likes } = this.state;

        return (
            <div className="card-body">
                <img
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.title}
                    onError={i => (i.target.src = `${DefaultPostImg}`)}
                    className="img-thunbnail mb-3"
                    style={{ height: "300px", width: "100%", objectFit: "cover" }}
                />

                {like ? (
                    <h3 onClick={this.likeToggle}>
                        <i
                            className="fa fa-thumbs-up text-success bg-dark"
                            style={{ padding: "10px", borderRadius: "50%" }}
                        />{" "}
                        {likes} Like
                    </h3>
                ) : (
                        <h3 onClick={this.likeToggle}>
                            <i
                                className="fa fa-thumbs-up text-warning bg-dark"
                                style={{ padding: "10px", borderRadius: "50%" }}
                            />{" "}
                            {likes} Like
                    </h3>
                    )}

                <p className="card-text">{post.body}</p>
                <br />
                <p className="font-italic mark">
                    Posted by <Link to={`${posterId}`}>{posterName} </Link>
                    on {new Date(post.createdDate).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link
                        to={`/posts`}
                        className="btn btn-raised btn-primary btn-sm mr-5"
                    >
                        Back to posts
                    </Link>

                    {isAuthenticated().user &&
                        isAuthenticated().user._id === post.postedBy._id && (
                            <>
                                <Link
                                    to={`/post/edit/${post._id}`}
                                    className="btn btn-raised btn-warning btn-sm mr-5"
                                >
                                    Update Post
                                </Link>
                                <button
                                    onClick={this.deleteConfirmed}
                                    className="btn btn-raised btn-danger"
                                >
                                    Delete Post
                                </button>
                            </>
                        )}
                    <div>
                        {isAuthenticated().user &&
                            isAuthenticated().user.role === "admin" && (
                                <div className="card mt-5">
                                    <div className="card-body">
                                        <h5 className="card-title">Admin</h5>
                                        <p className="mb-2 text-danger">
                                            Edit/Delete as an Admin
                                        </p>
                                        <Link
                                            to={`/post/edit/${post._id}`}
                                            className="btn btn-raised btn-warning btn-sm mr-5"
                                        >
                                            Update Post
                                        </Link>
                                        <button
                                            onClick={this.deleteConfirmed}
                                            className="btn btn-raised btn-danger"
                                        >
                                            Delete Post
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { post, redirectToPosts, redirectToSignin, comments } = this.state;

        if (redirectToPosts) {
            return <Navigate to={`/posts`} />;
        } else if (redirectToSignin) {
            return <Navigate to={`/signin`} />;
        }

        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

                {!post ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    this.renderPost(post)
                )}

                <PostComments
                    postId={post._id}
                    comments={comments.reverse()}
                    updateComments={this.updateComments}
                />
            </div>
        );
    }
}

export default Post;
