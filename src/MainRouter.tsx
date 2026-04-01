import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivateRoute from "./auth/PrivateRoute";

const Home = lazy(() => import("./components/Home"));
const NotFound = lazy(() => import("./components/NotFound"));
const Signup = lazy(() => import("./user/Signup"));
const Signin = lazy(() => import("./user/Signin"));
const ForgotPassword = lazy(() => import("./user/ForgotPassword"));
const ResetPassword = lazy(() => import("./user/ResetPassword"));
const SettingUser = lazy(() => import("./user/SettingUser"));
const SettingCollection = lazy(() => import("./user/SettingCollection"));
const Profile = lazy(() => import("./user/Profile"));
const FindPeople = lazy(() => import("./user/FindPeople"));
const Post = lazy(() => import("./post/Post"));
const Posts = lazy(() => import("./post/Posts"));
const EditPost = lazy(() => import("./post/EditPost"));
const NewPost = lazy(() => import("./post/NewPost"));
const BggCollection = lazy(() => import("./boardgame/BggCollection"));
const UserBgCollection = lazy(() => import("./boardgame/UserBgCollection"));
const Trades = lazy(() => import("./trades/Trades"));
const TradeHistory = lazy(() => import("./trades/TradeHistory"));
const TradeSettings = lazy(() => import("./trades/TradeSettings"));
const TradeListItems = lazy(() => import("./trades/TradeRequestContainer"));
const RequestSent = lazy(() => import("./components/RequestSent"));
const Users = lazy(() => import("./user/Users"));
const Admin = lazy(() => import("./admin/Admin"));
const CalContainer = lazy(() => import("./calendar/CalContainer"));

const PageLoader = () => (
  <div className="container mt-5 text-center">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const MainRouter: React.FC = () => {
  return (
    <>
      <NavBar />
      {/* <Chat /> */}
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/TheBoardgameApp-front" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/collection/bgg" element={<BggCollection />} />

            <Route
              path="/collection/bgguru"
              element={
                <PrivateRoute>
                  <UserBgCollection />
                </PrivateRoute>
              }
            />
            <Route
              path="/trades"
              element={
                <PrivateRoute>
                  <Trades />
                </PrivateRoute>
              }
            />
            <Route
              path="/trades/history"
              element={
                <PrivateRoute>
                  <TradeHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/trades/settings"
              element={
                <PrivateRoute>
                  <TradeSettings />
                </PrivateRoute>
              }
            />

            <Route path="/requestSent" element={<RequestSent />} />
            <Route path="/newTrade" element={<TradeListItems />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:resetPasswordToken"
              element={<ResetPassword />}
            />

            <Route
              path="/post/create"
              element={
                <PrivateRoute>
                  <NewPost />
                </PrivateRoute>
              }
            />
            <Route
              path="/post/edit/:postId"
              element={
                <PrivateRoute>
                  <EditPost />
                </PrivateRoute>
              }
            />
            <Route path="/post/:postId" element={<Post />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />

            <Route
              path="/findpeople"
              element={
                <PrivateRoute>
                  <FindPeople />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/:userId"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/edit/:userId"
              element={
                <PrivateRoute>
                  <SettingUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/edit/bgg/:userId"
              element={
                <PrivateRoute>
                  <SettingCollection />
                </PrivateRoute>
              }
            />

            <Route path="/calendar/:userId" element={<CalContainer />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default MainRouter;
