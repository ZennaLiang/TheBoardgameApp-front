import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

import SettingUser from "./user/SettingUser";
import SettingCollection from "./user/SettingCollection";
import Profile from "./user/Profile";
import FindPeople from "./user/FindPeople";

import Post from "./post/Post";
import Posts from "./post/Posts";
import EditPost from "./post/EditPost";
import NewPost from "./post/NewPost";

import BggCollection from "./boardgame/BggCollection";
import UserBgCollection from "./boardgame/UserBgCollection";

import Trades from "./trades/Trades";
import TradeHistory from "./trades/TradeHistory";
import TradeSettings from "./trades/TradeSettings";
import TradeListItems from "./trades/TradeRequestContainer";
import RequestSent from "./components/RequestSent";

import Users from "./user/Users";
import PrivateRoute from "./auth/PrivateRoute"; // only authenticated user can use

import Admin from "./admin/Admin";
import CalContainer from "./calendar/CalContainer";

// import Chat from "./chat/Chat";

class MainRouter extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        {/* <Chat /> */}
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
      </>
    );
  }
}

export default MainRouter;
