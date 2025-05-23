import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Video from "../assets/bg-video2.mp4";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

export default function Login() {
  const [flipped, setFlipped] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

useEffect(() => { //for remeber me
  const rememberedUsername = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  if (rememberedUsername && token) {
    setUsername(rememberedUsername);
    setRememberMe(true);
  }
}, []);


useEffect(() => { //auto login
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    navigate("/home");
  }
}, [navigate]);




  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),  // use username here!
      });

      const data = await res.json();

      if (res.ok) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("token", data.token);
        storage.setItem("username", data.username); // store username, not name
        navigate("/home");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div>
      <section id="login">
        <video autoPlay muted loop id="bg-video">
          <source src={Video} type="video/mp4" />
        </video>

    <div className="left">
  <h1 className="login-heading">Welcome to Playzio</h1>
  <p className="login-description">
    Dive into a world of fun with quick, addictive mini games made for
    pure entertainment. Play. Compete. Enjoy.
  </p>
</div>


        <div className="right">
          {!showForgot ? (
            <div className={`flip-container ${flipped ? "flipped" : ""}`}>
              <div className="flipper">
                <div className="box front">
                <h1 className="form-title">Sign in</h1>

                  <form onSubmit={handleLogin}>
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="minibox">
                      <label htmlFor="rememberme">
                        <input
                          type="checkbox"
                          id="rememberme"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />{" "}
                        Remember me
                      </label>
                      {/* <a href="#" onClick={() => setShowForgot(true)}>
                        Forgot Password?
                      </a> */}
                    </div>
                    <button type="submit">Sign In</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                  </form>
                  <p className="bottomtext">
                    Don't have an account?{" "}
                    <a href="#"  onClick={() => setFlipped(true)}> 
                      Sign Up
                    </a>
                  </p>
                  <p style={{display:"flex",fontSize:"10px",gap:"5px",opacity:"0.8",position:"absolute",bottom:"0px",left:"15px",width:"95%"}}><FaInfoCircle size={12}/>This site is currently under development. For the best experience, please use a desktop browser.</p>
                </div>

                <Register onFlipBack={() => setFlipped(false)} />
              </div>
            </div>
          ) : (
            <ForgotPassword onBackToLogin={() => setShowForgot(false)} />
          )}
        </div>
      </section>
    </div>
  );
}
