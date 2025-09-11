import React, { useState, useEffect, useCallback } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { getPost, removePost, likePost, unlikePost } from "./apiPost";
import DefaultPostImg from "../images/defaultPostImg.jpg";
import { isAuthenticated } from "../auth";
import PostComments from "./PostComments";

interface PostUser {
  _id: string;
  name: string;
}

interface PostData {
  _id: string;
  title: string;
  body: string;
  postedBy: PostUser;
  likes: string[];
  comments: any[];
  createdDate: string;
}

interface PostProps {}

const Post: React.FC<PostProps> = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | string>("");
  const [redirectToPosts, setRedirectToPosts] = useState(false);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<any[]>([]);

  const isLiked = useCallback((likes: string[]) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    return likes.indexOf(userId) !== -1;
  }, []);

  useEffect(() => {
    if (postId) {
      getPost(postId).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setPost(data);
          setLikes(data.likes.length);
          setLike(isLiked(data.likes));
          setComments(data.comments);
        }
      });
    }
  }, [postId, isLiked]);


  const likeToggle = useCallback(() => {
    if (!isAuthenticated()) {
      setRedirectToSignin(true);
      return false;
    }
    
    const callApi = like ? unlikePost : likePost;
    const userId = isAuthenticated().user._id;
    const currentPost = post as PostData;
    const currentPostId = currentPost._id;
    const token = isAuthenticated().token;

    callApi(userId, token, currentPostId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLike(!like); // toggle like state
        setLikes(data.likes.length);
      }
    });
  }, [like, post]);

  const deletePost = useCallback(() => {
    if (postId) {
      const token = isAuthenticated().token;
      removePost(postId, token).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setRedirectToPosts(true);
        }
      });
    }
  }, [postId]);

  const deleteConfirmed = useCallback(() => {
    const answer = window.confirm(
      "Are you sure you want to delete your post?"
    );
    if (answer) {
      deletePost();
    }
  }, [deletePost]);

  const updateComments = useCallback((commentsData: any[]) => {
    setComments(commentsData);
  }, []);

  const renderPost = useCallback((postData: PostData) => {
    const posterId = postData.postedBy ? `/user/${postData.postedBy._id}` : "";
    const posterName = postData.postedBy ? postData.postedBy.name : " Unknown";

    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${postData._id}`}
          alt={postData.title}
          onError={(i: any) => (i.target.src = `${DefaultPostImg}`)}
          className="img-thunbnail mb-3"
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
        />

        {like ? (
          <h3 onClick={likeToggle}>
            <i
              className="fa fa-thumbs-up text-success bg-dark"
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} Like
          </h3>
        ) : (
          <h3 onClick={likeToggle}>
            <i
              className="fa fa-thumbs-up text-warning bg-dark"
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} Like
          </h3>
        )}

        <p className="card-text">{postData.body}</p>
        <br />
        <p className="font-italic mark">
          Posted by <Link to={`${posterId}`}>{posterName} </Link>
          on {new Date(postData.createdDate).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link
            to={`/posts`}
            className="btn btn-raised btn-primary btn-sm mr-5"
          >
            Back to posts
          </Link>

          {isAuthenticated().user &&
            isAuthenticated().user._id === postData.postedBy._id && (
              <>
                <Link
                  to={`/post/edit/${postData._id}`}
                  className="btn btn-raised btn-warning btn-sm mr-5"
                >
                  Update Post
                </Link>
                <button
                  onClick={deleteConfirmed}
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
                      to={`/post/edit/${postData._id}`}
                      className="btn btn-raised btn-warning btn-sm mr-5"
                    >
                      Update Post
                    </Link>
                    <button
                      onClick={deleteConfirmed}
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
  }, [like, likes, likeToggle, deleteConfirmed]);

  if (redirectToPosts) {
    return <Navigate to={`/posts`} />;
  } else if (redirectToSignin) {
    return <Navigate to={`/signin`} />;
  }

  const postData = post as PostData;

  return (
    <div className="container">
      <h2 className="display-2 mt-5 mb-5">{typeof post === 'string' ? '' : postData.title}</h2>

      {typeof post === 'string' || !post ? (
        <div className="jumbotron text-center">
          <h2>Loading...</h2>
        </div>
      ) : (
        renderPost(postData)
      )}

      {typeof post !== 'string' && post && (
        <PostComments
          postId={postData._id}
          comments={[...comments].reverse()}
          updateComments={updateComments}
        />
      )}
    </div>
  );
};

export default Post;
