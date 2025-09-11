import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import { findPeople, followUser } from "./apiUser";
import DefaultProfileImg from "../images/avatar.png";
import { isAuthenticated } from "../auth";

interface User {
  _id: string;
  name: string;
  email: string;
}

const FindPeople: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [followMessage, setFollowMessage] = useState("");

  useEffect(() => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    findPeople(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });
  }, []);

  const clickFollow = useCallback((user: User, i: number) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    followUser(userId, token, user._id).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setUsers(prevUsers => {
          const newUsers = [...prevUsers];
          newUsers.splice(i, 1); // remove the followed user
          return newUsers;
        });
        setOpen(true);
        setFollowMessage(`Following ${user.name}`);
      }
    });
  }, []);

  const renderUsers = useCallback((usersToRender: User[]) => (
    <div className="row">
      {usersToRender.map((user, i) => (
        <div className="card col-md-4" key={user._id}>
          <div className="card-body">
            <img
              className="img-thunbnail card-img-top "
              src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
              onError={(e: any) => (e.target.src = `${DefaultProfileImg}`)}
              alt={user.name}
            />
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-primary btn-sm"
            >
              View Profile
            </Link>

            <button
              onClick={() => clickFollow(user, i)}
              className="btn btn-raised btn-info float-right btn-sm"
            >
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  ), [clickFollow]);

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Find People</h2>

      {open && (
        <div className="alert alert-success">{followMessage}</div>
      )}

      {renderUsers(users)}
    </div>
  );
};

export default FindPeople;
