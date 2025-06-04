
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WelcomeBanner.css";
import w from "../assets/w-img.jpg";


function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
    
     
      
        <div className="logo-text">
          <h2>ElectroWorld</h2>
        </div>
      
      
      
      <div className="left-side">
        <video
          className="welcome-video"
          src="https://cdn.pixabay.com/video/2017/11/02/12716-241674181_large.mp4"
          autoPlay
          loop
          muted
        ></video>
        <div className="welcome-text">
          <h1>Welcome to the Electronics Store</h1>
          <p>Explore the latest devices and technologies with us</p>
          <button onClick={() => navigate("/homepage")}>Shop Now</button>
        </div>
      </div>
      <div className="right-side">
        <img
          src={w}
          className="welcome-banner"
          alt="electronics"
        />
      </div>
    </div>
  );
}

export default WelcomePage;

