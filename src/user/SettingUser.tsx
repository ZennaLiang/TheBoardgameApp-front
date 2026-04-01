import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";

import { isAuthenticated } from "../auth";
import { getUser, updateUser, updateLocalStorUser } from "./apiUser";
import SettingSidebar from "./SettingSideBar";

import { Oval } from "react-loader-spinner";
import Alert from "../components/Alert";

const UserInfoValidation = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must to be more than 1 characters.")
    .max(75, "Name must be under 75 characters.")
    .matches(/^([a-zA-Z ])+$/, "Name can only contain letters"),
  email: Yup.string()
    .email("Invalid email address format")
    .max(254, "Email must be under 254 characters.")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be 8 characters at minimum")
    .max(64, "Password must be under 64 characters.")
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least 1 uppercase alphabetical character"
    )
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least 1 lowercase alphabetical character"
    ),
  matchPassword: Yup.string()
    .when("password", ([password], schema) =>
      password !== undefined && password.length > 0
        ? schema.required("Please retype password")
        : schema
    )
    .oneOf([Yup.ref("password"), undefined], "password doesnt match"),
});

const SettingUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    matchPassword: "",
    about: "",
  });
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);


  useEffect(() => {
    if (!userId) return;
    
    if (
      isAuthenticated().user._id !== userId &&
      isAuthenticated().user.role !== "admin"
    ) {
      setRedirectToProfile(true);
      return;
    }

    const init = async (userId: string) => {
      const token = isAuthenticated().token;
      try {
        const data = await getUser(userId, token);
        if (data.error) {
          setRedirectToProfile(true);
        } else {
          setUser({
            id: data._id,
            name: data.name,
            email: data.email,
            about: data.about,
            password: "",
            matchPassword: "",
          });
        }
      } catch (error) {
        console.error(error);
        setRedirectToProfile(true);
      }
    };

    init(userId);
  }, [userId]);

  const userProfileForm = () => (
    <Formik
      enableReinitialize={true}
      initialValues={user}
      validationSchema={UserInfoValidation}
      onSubmit={(values, { setSubmitting }) => {
        setLoading(true);
        const userData = new FormData();

        userData.append("name", values.name);
        userData.append("email", values.email);
        userData.append("about", values.about);
        if (values.password) {
          userData.append("password", values.password);
        }

        setTimeout(() => {
          if (!userId) return;
          const token = isAuthenticated().token;

          updateUser(userId, token, userData).then((data) => {
            if (data.error) {
              setLoading(false);
              setAlertStatus("danger");
              setAlertMsg("Unable to update information. Please try again later.");
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
            setSubmitting(false);
          });
        }, 2000);
      }}
    >
      {({ touched, errors, isSubmitting }) => (
        <Form>
          <div className="row">
            <div className="col-md-12 my-2">
              <h4>Personal Details</h4>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="name" className="text-muted col-3 col-form-label">
              Name
            </label>
            <div className="col-9">
              <Field
                disabled
                type="text"
                name="name"
                placeholder="Name"
                autoComplete="username"
                className={
                  getIn(errors, "name") && getIn(touched, "name")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="name"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="text-muted col-3 col-form-label" htmlFor="email">
              Email
            </label>
            <div className="col-9">
              <Field
                type="email"
                name="email"
                autoComplete="username"
                placeholder="Email"
                className={
                  getIn(errors, "email") && getIn(touched, "email")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="email"
                className="invalid-feedback"
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="text-muted col-3 col-form-label" htmlFor="about">
              About
            </label>
            <div className="col-9">
              <Field
                component="textarea"
                type="text"
                name="about"
                placeholder="Tell us something about you....."
                className={
                  getIn(errors, "about") && getIn(touched, "about")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="about"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 my-2">
              <h4>Change Password</h4>
            </div>
          </div>
          <div className="form-group row">
            <label
              className="text-muted col-3 col-form-label"
              htmlFor="password"
            >
              Password
            </label>
            <div className="col-9">
              <Field
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                className={
                  getIn(errors, "password") && getIn(touched, "password")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="password"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              className="text-muted col-3 col-form-label"
              htmlFor="matchPassword"
            >
              Confirm Password
            </label>
            <div className="col-9">
              <Field
                type="password"
                name="matchPassword"
                placeholder="Password"
                autoComplete="new-password"
                className={
                  getIn(errors, "matchPassword") &&
                  getIn(touched, "matchPassword")
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              <ErrorMessage
                component="div"
                name="matchPassword"
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
                {isSubmitting ? "Please wait..." : "Submit"}
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
            ariaLabel='oval-loading'
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
      <div className="maxDivWidth container-fluid">
        <div className="row my-3">
          {/* SettingSidebar is col-sm-3 */}
          <SettingSidebar highlight="UserSetting" userId={user.id} />
          <div className="col-sm-9">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h2>Basic Information</h2>
                    <hr />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {(isAuthenticated().user.role === "admin" ||
                      isAuthenticated().user._id === user.id) &&
                      userProfileForm()}
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

export default SettingUser;
