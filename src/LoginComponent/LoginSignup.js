import React, { useState } from "react";
import  "./LoginSignup.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const LoginSignup = () => {
  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const  Nav = useNavigate();
  let User = { name: "", email: "", password: "" };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password:""
  });
  const [LoginData, SetLoginData] = useState({
    email: '',
    password:""
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

   const handleloginData = (e ) => {
    const { name, value } = e.target; 
     SetLoginData({ ...LoginData, [name]: value });
   }
  const handleSubmit = (e) => {
    e.preventDefault(); 
    submitForm(formData); 
   
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault(); 
    submitLoginForm(LoginData);
  };

  const submitLoginForm = async(data) => {
    const payload = {...data, action: "login"};
    const response = await axios.post('http://localhost:8080/loginSignup',payload);
    const User_data = response.data
    console.log(User_data)
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify({ ...User_data, password: "" }));
   
    if(response.status === 200){
      alert("Login Successful!");
      Nav("/dashboard");
    }else if(response.data === "Invalid Credentials"){
      alert("Login failed!");
    }
    
  }

  const submitForm = async(data) => {
    const payload = {...data, action: "register"};
    const response = await axios.post('http://localhost:8080/loginSignup',payload);
    const User_data = response.data
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify({ ...User_data, password: "" }));
    if(response.status === 201){
      alert("Successfully registered!");
      Nav("/")
    }else if (response.data ==="User Already Exist") alert("User Already Exist");
    else{
      alert("Registration failed!");
    }
    console.log(response);
  };

  const handleSignUpClick = () => {
    setRightPanelActive(true);
    
  };

  const handleSignInClick = () => {
    setRightPanelActive(false);
  };

  return (
    <body className="LoginSignup-body">
      <div
        className={`container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        id="container"
      >
        <div className="form-container sign-up-container">
          <form className="LoginSignup-form" action="#"  onSubmit={handleSubmit}>
            <h1 className="LoginSignup-h1">Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i> {/* Facebook Icon */}
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i> {/* Google Icon */}
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i> {/* LinkedIn Icon */}
              </a>
            </div>

            <span className="LoginSignup-span">
              or use your email for registration
            </span>
            <input
              className="LoginSignup-input"
              type="text"
              name = "name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              className="LoginSignup-input"
              name = "email"
              type="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              className="LoginSignup-input"
              name = "password"
              type="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
            />
            <button className="LoginSignup-button">Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form className="LoginSignup-form" action="#" onSubmit={handleLoginSubmit}>
            <h1 LoginSignup-h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social LoginSignup-a">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social LoginSignup-a">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social LoginSignup-a">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span className="LoginSignup-span">or use your account</span>
            <input
              className="LoginSignup-input"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleloginData }
              value={LoginData.email}
              
            />
            <input
              className="LoginSignup-input"
              type="password"
              placeholder="Password"
              name="password"
              value={LoginData.password}
              onChange={handleloginData}
            />
            <a className="LoginSignup-a" href="#">
              Forgot your password?
            </a>
            <button className="LoginSignup-button">Sign In</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 LoginSignup-h1>Welcome Back!</h1>
              <p className="LoginSignup-p">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost LoginSignup-button"
                onClick={handleSignInClick}
                id="signIn"
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="LoginSignup-h1">Hello, Friend!</h1>
              <p className="LoginSignup-p">
                Enter your personal details and start your journey with us
              </p>
              <button
                className="ghost LoginSignup-button"
                onClick={handleSignUpClick}
                id="signUp"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default LoginSignup;
