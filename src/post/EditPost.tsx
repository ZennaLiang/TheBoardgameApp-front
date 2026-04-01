import React, { useState, useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";

import { getPost, updatePost } from "./apiPost";
import { isAuthenticated } from "../auth";
import DefaultPostImg from "../images/defaultPostImg.jpg";

const EditPost: React.FC = () => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  const [error, setError] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const { postId } = useParams<{ postId: string }>();
  const postDataRef = useRef<FormData>(new FormData());

  const init = (postId: string) => {
    getPost(postId).then((data) => {
      if (data.error) {
        setRedirectToProfile(true);
      } else {
        setId(data._id);
        setTitle(data.title);
        setBody(data.body);
        setError("");
      }
    });
  };

  useEffect(() => {
    if (postId) {
      init(postId);
    }
  }, [postId]);

  const isValid = () => {
    if (fileSize > 100000) {
      setError("File size should be less than 100kb");
      setLoading(false);
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      setError("All fields are required");
      setLoading(false);
      return false;
    }
    if (title.length > 60) {
      setError("Title is limited to 60 characters");
      setLoading(false);
      return false;
    }
    return true;
  };

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setError("");
    const target = event.target as HTMLInputElement;
    const value = name === "photo" ? target.files?.[0] : target.value;

    const newFileSize = name === "photo" && target.files?.[0] ? target.files[0].size : 0;
    if (value !== undefined) {
      postDataRef.current.set(name, value as string | File);
    }
    
    if (name === "title") {
      setTitle(value as string);
    } else if (name === "body") {
      setBody(value as string);
    }
    
    setFileSize(newFileSize);
  };

  const clickSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (isValid() && postId) {
      const token = isAuthenticated().token;

      updatePost(postId, token, postDataRef.current).then((data) => {
        if (data.error) {
          setError(data.error);
          setLoading(false);
        } else {
          setLoading(false);
          setTitle("");
          setBody("");
          setRedirectToProfile(true);
        }
      });
    }
  };

  const editPostForm = (
    <form>
      <div className="form-group">
        <label className="text-muted">Post Photo</label>
        <input
          onChange={handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Body</label>
        <textarea
          onChange={handleChange("body")}
          className="form-control"
          value={body}
        />
      </div>

      <button onClick={clickSubmit} className="btn btn-raised btn-primary">
        Update Post
      </button>
    </form>
  );

  if (redirectToProfile) {
    return <Navigate to={`/user/${isAuthenticated().user._id}`} />;
  }

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">{title}</h2>

      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>

      {loading ? (
        <div className="jumbotron text-center">
          <h2>Loading...</h2>
        </div>
      ) : (
        ""
      )}
      <img
        style={{ height: "200px", width: "auto" }}
        className="img-thumbnail"
        src={`${
          import.meta.env.VITE_API_URL
        }/post/photo/${id}?${new Date().getTime()}`}
        onError={(i) => ((i.target as HTMLImageElement).src = `${DefaultPostImg}`)}
        alt={title}
      />

      {editPostForm}
    </div>
  );
};

export default EditPost;
