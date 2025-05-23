import React, { useState, useEffect } from 'react';
import "./nav.css";
import { FaSearch, FaStar } from 'react-icons/fa';
import Logo from "../assets/Playzio.png";
import ProfilePanel from './Profile';
import Dp from "../assets/dp.jpg"; 

export default function Nav() {
  const [showProfile, setShowProfile] = useState(false);
  const [photo, setPhoto] = useState(Dp);

  useEffect(() => {
    // Load profile photo when component mounts
    const loadProfilePhoto = async () => {
      const name = localStorage.getItem('name') || sessionStorage.getItem('name');
      if (name) {
        try {
          const res = await fetch(`http://localhost:5000/api/user/profile?name=${name}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.photo_url) {
              setPhoto(data.photo_url);
            }
          }
        } catch (err) {
          console.error("Failed to load profile photo:", err);
        }
      }
    };
    loadProfilePhoto();
  }, []);

  const handleOpenProfile = () => {
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const handlePhotoUpdate = (newPhoto) => {
    setPhoto(newPhoto);
  };

  return (
    <>
      <section id="nav">
        <div className="left">
          <a href=""><img src={Logo} alt="" /></a>
          {/* {!showProfile && (
            <div className="searchbox">
              <input type="text" placeholder='search...' />
              <a href=""><FaSearch /></a>
            </div>
          )} */}
        </div>

        <div className="middle">
          <h3>PLAYZIO</h3>
        </div>

        {!showProfile && (
          <div className="right">
            <a href=""><FaStar color="gold" size={24} /></a>
            <a href="#" onClick={handleOpenProfile}>
              <span>
                {photo ? (
                  <img
                    src={photo}
                    alt="User"
                  />
                ) : (
                  <div className="default-avatar" />
                )}
              </span>
            </a>
          </div>
        )}
      </section>

      {showProfile && (
        <ProfilePanel 
          onClose={handleCloseProfile} 
          photo={photo} 
          setPhoto={handlePhotoUpdate} 
        />
      )}
    </>
  );
}