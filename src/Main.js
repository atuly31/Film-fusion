import React, { useState } from "react";
import Navbar from "./Components/NavigationBar";
import App from "./App";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "./LoginComponent/LoginSignup";
import ProfilePage from "./Components/Profile";
const Main = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <App />
            </>
          }
        />
        {/* <Route path="/profile" element={<ProfilePage/>}></Route> */}
        <Route path="/loginSignup" element={<LoginSignup />}></Route>
        <Route path="/dashboard" element={<ProfilePage />}></Route>
      </Routes>
    </>
  );
};

export default Main;
