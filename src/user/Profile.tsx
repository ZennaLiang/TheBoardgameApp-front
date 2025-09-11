import React, { useState, useEffect, useCallback } from "react";
import { Navigate, Link, useParams } from "react-router-dom";
import { getUser } from "./apiUser";
import { isAuthenticated } from "../auth";
import DefaultProfileImg from "../images/avatar.png";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import { getPostsByUserId } from "../post/apiPost";
import Animator from "../animator/Animator";
import Helpers from "../helpers";

interface User {
  _id: string;
  name: string;
  email: string;
  about?: string;
  createdDate: string;
  following: any[];
  followers: any[];
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User>({ following: [], followers: [] } as User);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [following, setFollowing] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<any[]>([]);

  const loadPosts = useCallback((userIdToLoad: string) => {
    const token = isAuthenticated().token;
    getPostsByUserId(userIdToLoad, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  }, []);

  const isFollowing = useCallback((userData: User) => {
    const jwt = isAuthenticated();
    const match = userData.followers.find(follower => {
      return follower._id === jwt.user._id;
    });
    return match;
  }, []);

  const initProfile = useCallback((userIdToInit: string) => {
    const token = isAuthenticated().token;
    getUser(userIdToInit, token).then(data => {
      if (data.error) {
        setRedirectToSignin(true);
      } else {
        const isFollowingUser = isFollowing(data);
        setUser(data);
        setFollowing(!!isFollowingUser);
        loadPosts(data._id);
      }
    });
  }, [isFollowing, loadPosts]);

  useEffect(() => {
    if (userId) {
      initProfile(userId);
      Animator.animate();
    }
  }, [userId, initProfile]);


  const clickFollowButton = useCallback((callApi: Function) => {
    const currentUserId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    callApi(currentUserId, token, user._id).then((data: any) => {
      if (data.error) {
        setError(data.error);
      } else {
        setUser(data);
        setFollowing(!following);
      }
    });
  }, [user._id, following]);

  if (redirectToSignin) return <Navigate to="/signin" />;

  // use new Date() to update image right away
  const photoUrl = user._id
    ? `${process.env.REACT_APP_API_URL}/user/photo/${
        user._id
      }?${new Date().getTime()}`
    : DefaultProfileImg;

  return (
    <div className="container">
      <div className="row animator">
        <div className="col-lg-4">
          <div className="row mt-5 justify-content-center">
            <img
              style={{ height: "200px", width: "auto", borderRadius: "50%" }}
              src={photoUrl}
              onError={(i: any) => (i.target.src = `${DefaultProfileImg}`)}
              alt={user.name}
            />
          </div>
          <div className="row justify-content-center">
            <h1 className="mt-3 text-center">
              {Helpers.capitalize(user.name)}
            </h1>
          </div>
          <div className="row justify-content-center">
            <p>
              {`Member Since: ${new Date(user.createdDate).toDateString()}`}
            </p>
          </div>
          <div className="row justify-content-center">
            <p>
              {" "}
              <i className="fa fa-envelope"></i> {user.email}
            </p>
          </div>
          {isAuthenticated().user &&
          isAuthenticated().user._id === user._id ? (
            <div className="d-flex flex-column mx-5">
              <Link className="btn btn-success" to={`/post/create`}>
                Create Post
              </Link>
              <Link
                className="btn btn-primary my-2"
                to={`/user/edit/${user._id}`}
              >
                Edit Profile
              </Link>
              <DeleteUser userId={user._id} />
            </div>
          ) : (
            <div className="d-flex flex-column mx-5">
              <FollowProfileButton
                following={following}
                onButtonClick={clickFollowButton}
              />
            </div>
          )}
        </div>
        <div className="col-lg-8">
          <div className="row">
            <div className="col-12 my-4 text-center">
              <div className="card p-3">
                <div className="card-body">
                  <ProfileTabs
                    followers={user.followers}
                    following={user.following}
                    posts={posts}
                  />
                </div>
              </div>

              {user.about ? (
                <div>
                  <hr />
                  <h4>About</h4>
                  <p className="lead">{user.about}</p>
                </div>
              ) : (
                <span></span>
              )}
            </div>
          </div>
          <div className="row py-3 d-flex justify-content-center">
            {isAuthenticated().user &&
              isAuthenticated().user.role === "admin" && (
                <div className="card mt-5">
                  <div className="card-body">
                    <h5 className="card-title">Admin</h5>
                    <p className="mb-2 text-danger">
                      Edit/Delete as an Admin
                    </p>
                    <Link
                      className="btn btn-raised btn-success mr-5"
                      to={`/user/edit/${user._id}`}
                    >
                      Edit Profile
                    </Link>
                    <DeleteUser userId={user._id} />
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
