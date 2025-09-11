import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import TradesSideBar from "./TradesSideBar";
import { Navigate } from "react-router-dom";
import {
  getGuruCollection,
  updateUserBoardgames,
} from "../boardgame/apiBoardgame";
import { getUserId } from "../user/apiUser";
import Animator from "../animator/Animator";
import { ListGroup, ListGroupItem } from "reactstrap";

interface TradeSettingsProps {
  userId?: string;
}

const TradeSettings: React.FC<TradeSettingsProps> = ({ userId }) => {
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [userBoardgames, setUserBoardgames] = useState<any[]>([]);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const loadUserBoardgameData = async (user: string) => {
    try {
      const id = await getUserId(user);
      const bgList = await getGuruCollection(id, isAuthenticated().token);
      const filteredBgList = bgList.filter((bg) => bg.forTrade === true);
      setUserBoardgames(filteredBgList);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const user = isAuthenticated().user.name;
    loadUserBoardgameData(user);
    setUserID(isAuthenticated().user._id);
  }, []);

  useEffect(() => {
    if (
      isAuthenticated()._id !== userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      setRedirectToHome(true);
    } else {
      Animator.animate();
    }
  }, [userId]);

  const onClickCondition = (e: React.MouseEvent<HTMLButtonElement>, listID: string) => {
    const group = document.querySelectorAll(
      `.btn-group[data-id='${listID}'] button`
    );

    group.forEach((el) => {
      console.log(el);
      if (el.classList.contains("btn-primary")) {
        el.classList.replace("btn-primary", "btn-outline-primary");
      }
    });

    (e.target as HTMLButtonElement).classList.replace("btn-outline-primary", "btn-primary");
  };

  const onClickUpdate = () => {
    const data = [...userBoardgames];
    data.forEach((bg) => {
      const primaryBtn = document.querySelector(
        `.btn-group[data-id='${bg._id}'] .btn-primary`
      ) as HTMLButtonElement;
      bg.condition = primaryBtn.innerText;
      bg.price = 5;
    });

    console.log("DATA");
    console.log(data);
    setUpdateStatus("saving");
    
    if (userID) {
      updateUserBoardgames(userID, data)
        .then((data) => {
          setUpdateStatus("saved");
          return data;
        })
        .catch((error) => {
          setUpdateStatus("error");
        });
    }
  };

  const badgeBgRender = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "badge-success";
      case "Good":
        return "badge-primary";
      case "Fair":
        return "badge-warning";
      case "Poor":
        return "badge-danger";
      default:
        break;
    }
  };

  const renderCondition = (expected: string, condition: string) => {
    if (expected === condition) {
      return "btn-primary";
    } else {
      return "btn-outline-primary";
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const tag = e.currentTarget.value;

    if (e.key === "Enter" && tag.trim().length > 0) {
      const copy = [...userBoardgames];
      copy[index].tags.push(tag);

      copy[index].tags = [...new Set(copy[index].tags)];
      setUserBoardgames(copy);
      e.currentTarget.value = "";
    }
  };

  const deleteTag = (e: React.MouseEvent<HTMLDivElement>, index: number, tagIndex: number) => {
    const copy = [...userBoardgames];
    copy[index].tags.splice(tagIndex, 1);
    setUserBoardgames(copy);
  };

  if (redirectToHome) return <Navigate to="/" />;

  return (
    <div className="container-fluid">
      <div className="row my-3 justify-content-center">
        {/* BgSidebar is col-sm-3 */}
        <TradesSideBar highlight="TradeSettings" />
        <div className="col-lg-6 animator">
          <h4>Trade Settings</h4>
          <ListGroup id="tradedToYou">
            {userBoardgames.map((item, index) => (
              <ListGroupItem
                className="font-weight-bold d-flex flex-column flex-lg-row justify-content-between align-items-center"
                key={item.boardgame._id}
                id={item.boardgame.id}
              >
                <div className="d-flex my-2 my-lg-0 flex-column flex-lg-row justify-content-center align-items-center">
                  <img
                    className="img-thumbnail listThumbnail"
                    src={item.boardgame.imgThumbnail}
                    alt="thumbnail"
                  />
                  <div>
                    {item.boardgame.title}
                    <br />
                    {item.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="badge badge-info p-1 mx-1">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-center align-items-center">
                  <span className="font-weight-normal">Condition: </span>
                  <div className="btn-group mx-3" data-id={item._id}>
                    <button
                      value="Excellent"
                      onClick={(e) => {
                        onClickCondition(e, item._id);
                      }}
                      className={`btn ${renderCondition(
                        "Excellent",
                        item.condition
                      )} cursor-pointer`}
                    >
                      Excellent
                    </button>
                    <button
                      value="Good"
                      onClick={(e) => {
                        onClickCondition(e, item._id);
                      }}
                      className={`btn ${renderCondition(
                        "Good",
                        item.condition
                      )} cursor-pointer`}
                    >
                      Good
                    </button>
                    <button
                      value="Fair"
                      onClick={(e) => {
                        onClickCondition(e, item._id);
                      }}
                      className={`btn ${renderCondition(
                        "Fair",
                        item.condition
                      )} cursor-pointer`}
                    >
                      Fair
                    </button>
                    <button
                      value="Poor"
                      onClick={(e) => {
                        onClickCondition(e, item._id);
                      }}
                      className={`btn ${renderCondition(
                        "Poor",
                        item.condition
                      )} cursor-pointer`}
                    >
                      Poor
                    </button>
                  </div>
                  <div className="dropdown">
                    <div
                      className="btn btn-outline-info"
                      data-toggle="dropdown"
                    >
                      <i className="fa fa-tags"></i> Tags
                    </div>
                    <div
                      className="dropdown-menu dropdown-menu-right p-3 shadow"
                      style={{ minWidth: "250px" }}
                    >
                      <h5 className="text-center">
                        Press 'Enter' to add tags
                      </h5>
                      <input
                        placeholder="Enter new tag"
                        className="form-control text-center"
                        type="text"
                        maxLength={25}
                        minLength={1}
                        onKeyUp={(e) => {
                          addTag(e, index);
                        }}
                      />

                      {item.tags.map((tag, tagIndex) => (
                        <div
                          key={tagIndex}
                          className="dropdown-item text-center p-0 d-flex justify-content-between align-items-center"
                          onClick={(e) => {
                            deleteTag(e, index, tagIndex);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <span>{tag}</span>
                          <div className="p-2">
                            <i className="fa fa-minus-circle text-danger"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
          <button
            className="btn btn-success mt-2 float-right"
            onClick={onClickUpdate}
          >
            Update
          </button>
          <div className="my-5 text-right">
            {updateStatus === "idle" && <span></span>}
            {updateStatus === "saving" && <span>Saving...</span>}
            {updateStatus === "saved" && (
              <span className="text-success">Saved!</span>
            )}
            {updateStatus === "error" && (
              <span className="text-danger">Error!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeSettings;
