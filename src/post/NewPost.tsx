import React, { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";

import { isAuthenticated } from "../auth";
import { createPost } from "./apiPost";
import DefaultPostImg from "../images/defaultPostImg.jpg";
const NewPost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>({});
  const [fileSize, setFileSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  
  const postDataRef = useRef<FormData>(new FormData());

  useEffect(() => {
    setUser(isAuthenticated().user);
  }, []);

  const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const isValid = () => {
    if (photo && !ALLOWED_MIME_TYPES.includes((photo as unknown as File).type)) {
      setError("Only JPEG, PNG, GIF and WebP images are allowed");
      setLoading(false);
      return false;
    }
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
    
    if (name === "photo" && target.files?.[0]) {
      setFile(URL.createObjectURL(target.files[0]));
      setPhoto(target.files[0] as any);
    } else if (name === "title") {
      setTitle(value as string);
    } else if (name === "body") {
      setBody(value as string);
    }

    if (value !== undefined) {
      postDataRef.current.set(name, value as string | File);
    }
    setFileSize(newFileSize);
  };

  const clickSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      createPost(userId, token, postDataRef.current).then((data) => {
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

  const newPostForm = (
    <form>
      <label className="text-muted">Title</label>
      <br />
      <input
        onChange={handleChange("title")}
        type="text"
        className="form-control"
        value={title}
      />

      <div className="form-group mt-2">
        <label className="text-muted">Body</label>
        <textarea
          rows={4}
          onChange={handleChange("body")}
          className="form-control"
          value={body}
          style={{ resize: "none" }}
        />
      </div>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text" id="inputGroupFileAddon01">
            Upload
          </span>
        </div>
        <div className="custom-file">
          <input
            type="file"
            accept="image/*"
            data-max-file-size="1M"
            className="custom-file-input"
            id="inputGroupFile01"
            onChange={handleChange("photo")}
            aria-describedby="inputGroupFileAddon01"
          />
          <label className="custom-file-label" htmlFor="inputGroupFile01">
            Choose file
          </label>
        </div>
      </div>

      <button
        onClick={clickSubmit}
        className="btn btn-raised btn-primary mt-3"
      >
        Create Post
      </button>
    </form>
  );

  if (redirectToProfile) {
    return <Navigate to={`/user/${user._id}`} />;
  }

  return (
    <div className="container">
      <h1 className="mt-5 mb-4">
        <b>Create a new post</b>
      </h1>
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
        src={file}
        onError={(i) => ((i.target as HTMLImageElement).src = `${DefaultPostImg}`)}
        alt={title}
      />
      {newPostForm}
    </div>
  );
};

export default NewPost;
