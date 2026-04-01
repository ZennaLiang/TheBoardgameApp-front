import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";
import { isAuthenticated } from "../auth";
import { getGuruCollection} from "../boardgame/apiBoardgame";
import {
  getUser,
  updateBggBoardgamesByUsername,
  updateLocalStorUser,
} from "./apiUser";

import { Oval } from 'react-loader-spinner';
import Alert from "../components/Alert";
import SettingSidebar from "./SettingSideBar";

const SettingCollection: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState({
    id: "",
    bggUsername: "",
  });
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);


  useEffect(() => {
    const init = async (userId: string) => {
      const token = isAuthenticated().token;
      try {
        const data = await getUser(userId, token);
        if (data.error) {
          setRedirectToProfile(true);
        } else {
          setUser({
            id: data._id,
            bggUsername: data.bggUsername === undefined ? "" : data.bggUsername,
          });
        }
      } catch (error) {
        console.error(error);
        setRedirectToProfile(true);
      }
    };

    if (!userId) return;
    init(userId);
  }, [userId]);

  const bggForm = (bggUsername: string) => (
    <Formik
      enableReinitialize={true}
      initialValues={user}
      validationSchema={Yup.object().shape({
        bggUsername: Yup.string().required("Name is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setLoading(true);
        const userData = new FormData();
        userData.append("bggUsername", values.bggUsername);
        setTimeout(() => {
          if (!userId) return;
          const token = isAuthenticated().token;

          updateBggBoardgamesByUsername(userId, token, values.bggUsername).then(
            (data) => {
              if (data.error) {
                setAlertStatus("danger");
                setAlertMsg(data.error);
              } else if (isAuthenticated().user.role === "admin") {
                setAlertStatus("success");
                setAlertMsg("User information updated.");
              } else {
                getGuruCollection(isAuthenticated().user._id, token).then((collection) => {
                  data.user.boardgames = collection;
                   updateLocalStorUser(data, () => {
                    setAlertStatus("success");
                    setAlertMsg("User information updated.");
                  });
                })
              }

              setLoading(false);
              setAlertVisible(true);
              setSubmitting(false);
            }
          );
        });
      }}
    >
      {({ touched, errors, isSubmitting }) => (
        <Form>
          <div className="form-group row">
            <label htmlFor="name" className="text-muted col-3 col-form-label">
              BGG UserName
            </label>
            <div className="col-9">
              <Field
                type="text"
                name="bggUsername"
                placeholder="Boardgamegeek username"
                className={
                  getIn(errors, "bggUsername") && getIn(touched, "bggUsername")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="bggUsername"
                className="invalid-feedback"
              />
            </div>
          </div>

          <div className="form-group row justify-content-md-end">
            <div className="col-md-3">
              <button
                type="submit"
                className="btn btn-success btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Please wait..." : "Sync"}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  if (redirectToProfile) {
    return <Navigate to={`/user/${user.id}`} />;
  }

  return (
    <>
      <Alert type={alertStatus} message={alertMsg} visible={alertVisible} />
      {loading && (
        <div className="d-flex justify-content-center">
          <Oval
            height={40}
            width={40}
            color="#4fa94d"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
      <div className="maxDivWidth container-fluid">
        <div className="row my-3">
          {/* SettingSidebar is col-sm-3 */}
          <SettingSidebar highlight="Boardgame" userId={user.id} />
          <div className="col-sm-9">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h2>Boardgamegeek Information</h2>
                    <hr />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <h6 className="lead">
                      <span className="font-weight-bold">Note: </span>{" "}
                      Syncing your Boardgamegeek collection will not remove
                      any boardgame from Boardgameguru. It will add any
                      boardgame(s) missing and update status from
                      boardgamegeek to boardgameguru.
                    </h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {(isAuthenticated().user.role === "admin" ||
                      isAuthenticated().user._id === user.id) &&
                      bggForm(user.bggUsername)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingCollection;
