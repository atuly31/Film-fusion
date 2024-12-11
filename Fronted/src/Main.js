import React from "react";
import App from "./App";
import { Routes, Route} from "react-router-dom";
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
        <Route path="/loginSignup" element={<LoginSignup />}></Route>
        <Route path="/dashboard" element={<ProfilePage />}></Route>
      </Routes>
    </>
  );
};

export default Main;
