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
    const loadProfilePhoto = async () => {
      const username = localStorage.getItem('username') || sessionStorage.getItem('username');
      if (username) {
        try {
          const res = await fetch(`https://playzio-1.onrender.com/api/user/profile?username=${username}`, {
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

    // Reload profile photo after closing profile panel
    const username = localStorage.getItem('username') || sessionStorage.getItem('username');
    if (username) {
      fetch(`https://playzio-1.onrender.com/api/user/profile?username=${username}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      })
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data?.photo_url) {
            setPhoto(data.photo_url);
          }
        })
        .catch(err => console.error("Failed to reload profile photo:", err));
    }
  };

  const handlePhotoUpdate = (newPhoto) => {
    setPhoto(newPhoto);
  };

  return (
    <>
      <section id="nav">
        <div className="left">
          <a href="/">
            <img src={Logo} alt="Playzio Logo" />
          </a>
          {/* {!showProfile && (
            <div className="searchbox">
              <input type="text" placeholder="search..." />
              <a href="#">
                <FaSearch />
              </a>
            </div>
          )} */}
        </div>

        <div className="middle">
          <h3>PLAYZIO</h3>
        </div>

        {!showProfile && (
          <div className="right">
            <a href="#">
              <FaStar color="gold" size={24} />
            </a>
            <a href="#" onClick={handleOpenProfile}>
              <span>
                {photo ? (
                  <img src={photo} alt="User" />
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
