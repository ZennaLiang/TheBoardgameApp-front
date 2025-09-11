import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import React, { useState, useEffect } from "react";
import { getUser, updateUser, updateLocalStorUser } from "./apiUser";
import DefaultProfileImg from "../images/avatar.png";

import Alert from "../components/Alert";

/* 
This sidebar is use for all Settings pages
Use this format to keep consistency

<div className="maxDivWidth container-fluid">
  <div className="row my-3">
    <SettingSidebar highlight="TitleToHighLight" />
    <div className="col-sm-9">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <h2>Main Heading</h2>
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
             any children html
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>; 
*/

interface SettingSideBarProps {
  highlight: string;
  userId: string;
}

const SettingSideBar: React.FC<SettingSideBarProps> = ({ highlight, userId }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  const userDataRef = React.useRef<FormData>(new FormData());

  useEffect(() => {
    const init = async (userId: string) => {
      const token = isAuthenticated().token;
      try {
        const data = await getUser(userId, token);
        if (data.error) {
          console.error(data.error);
        } else {
          setId(data._id);
          setName(data.name);
          setFile(data._id
            ? `${process.env.REACT_APP_API_URL}/user/photo/${
                data._id
              }?${new Date().getTime()}`
            : DefaultProfileImg);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const currentUserId = isAuthenticated().user._id;
    init(currentUserId);
  }, []);

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlertVisible(false);
    if (
      event.target.files?.[0] !== undefined &&
      event.target.files[0].size < 1000000
    ) {
      setFile(URL.createObjectURL(event.target.files[0]));
      userDataRef.current.set("photo", event.target.files[0]);
    } else {
      setAlertMsg("File size should be less than 1mb");
      setAlertStatus("danger");
      setAlertVisible(true);
    }
  };

  const clickSubmitImg = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    const token = isAuthenticated().token;

    try {
      const data = await updateUser(userId, token, userDataRef.current);
      if (data.error) {
        setLoading(false);
        setAlertStatus("danger");
        setAlertMsg(data.error);
        setAlertVisible(true);
      } else if (isAuthenticated().user.role === "admin") {
        setLoading(false);
        setAlertStatus("success");
        setAlertMsg("User information updated.");
        setAlertVisible(true);
      } else {
        updateLocalStorUser(data, () => {
          setLoading(false);
          setAlertStatus("success");
          setAlertMsg("User information updated.");
          setAlertVisible(true);
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setAlertStatus("danger");
      setAlertMsg("An error occurred while updating");
      setAlertVisible(true);
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="updateProfileImgModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="profileImgUploadModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="profileImgUploadModal">
                Update Profile Image
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body py-0 px-0">
              <form>
                <div className="col-12">
                  <Alert
                    type={alertStatus}
                    message={alertMsg}
                    visible={alertVisible}
                    className="mb-2"
                  />
                </div>
                <div className="row justify-content-center my-2">
                  <img
                    style={{ height: "150px", width: "auto" }}
                    className="img-thumbnail"
                    src={file || DefaultProfileImg}
                    onError={(i) => ((i.target as HTMLImageElement).src = DefaultProfileImg)}
                    alt={name}
                  />
                </div>
                <div className="row justify-content-center my-2">
                  <label
                    className="btn btn-info btn-rounded my-auto"
                    htmlFor="profileImg"
                  >
                    <span>Choose a photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      data-max-file-size="1M"
                      name="photo"
                      className="custom-file-input"
                      id="profileImg"
                      onChange={handleChange("photo")}
                      aria-describedby="profileImageUpload"
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </form>
            </div>
            <div className="modal-footer mt-2">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={alertVisible && file !== null}
                onClick={clickSubmitImg}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-sm-3">
        <div className="text-center mb-4">
          <img
            style={{ maxHeight: "200px", maxWidth: "200px" }}
            className="avatar img-circle img-thumbnail rounded-circle"
            src={
              id
                ? `${
                    process.env.REACT_APP_API_URL
                  }/user/photo/${id}?${new Date().getTime()}`
                : DefaultProfileImg
            }
            onError={(i) => ((i.target as HTMLImageElement).src = DefaultProfileImg)}
            alt={name}
          />
          <button
            type="button"
            className="btn btn-outline-primary col-sm-8 my-2"
            data-toggle="modal"
            data-target="#updateProfileImgModal"
          >
            Update Photo
          </button>
        </div>

        <div className="list-group ">
          <span className="list-group-item list-group-item-dark font-weight-bold">
            Settings
          </span>
          <Link
            className={`list-group-item list-group-item-action ${
              highlight === "UserSetting" ? "active" : ""
            }`}
            to={`/user/edit/${isAuthenticated().user._id}`}
          >
            User Setting <span className="sr-only">(current)</span>
          </Link>
          <Link
            className={`list-group-item list-group-item-action ${
              highlight === "Boardgame" ? "active" : ""
            }`}
            to={`/user/edit/bgg/${isAuthenticated().user._id}`}
          >
            Boardgames
          </Link>
        </div>
      </div>
    </>
  );
};
export default SettingSideBar;
