import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import { MdEdit } from "react-icons/md";
export default function ProfilePanel({
  onClose,
  photo,
  setPhoto,
  refreshProfile,
}) {
  const panelRef = useRef();
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const username =
    localStorage.getItem("username") || sessionStorage.getItem("username");

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await fetch(
          `https://playzio-1.onrender.com/api/user/profile?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setDisplayName(data.name);
          localStorage.setItem("name", data.name); 
          sessionStorage.setItem("name", data.name);
          setEmail(data.email);
          if (data.photo_url) {
            setPhoto(data.photo_url);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    loadProfile();

    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [username, onClose, setPhoto]);

  const updateUser = async (updates) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch("https://playzio-1.onrender.com/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, ...updates }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Update failed");
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageURL = reader.result;
      const success = await updateUser({ photo_url: imageURL });
      if (success) {
        setPhoto(imageURL);
        refreshProfile();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNameBlur = async () => {
    if (displayName.trim() === "") {
      setError("Name cannot be empty");
      return;
    }
    const success = await updateUser({ name: displayName });
    if (success) {
      setIsEditingName(false);
      refreshProfile();
    }
  };

  const handleEmailBlur = async () => {
    const success = await updateUser({ email });
    if (success) {
      setIsEditingEmail(false);
      refreshProfile();
    }
  };

  const handleLogout = () => {
    // Clear all auth-related storage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");

    // Navigate to login page
    navigate("/");
  };

  return (
    <div className="profile-panel-overlay">
      <div className="profile-panel" ref={panelRef}>
        <button className="arrow" onClick={onClose}>
          <FaArrowLeft size={24} color="black" />
        </button>

        <div className="data">
          <h2>User Profile</h2>

          <span>
            <img
              src={photo || "/default-profile.png"}
              alt="Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-profile.png";
              }}
            />
          </span>

          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handlePhotoChange}
          />
          <button
            className="change-photo-btn"
            onClick={() => fileInputRef.current.click()}
          >
            Edit Image
            <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 122.88 82.47"
              width="14px"
              height="14px"
              style={{ marginLeft: "5px" }}
            >
              <title>edit-image</title>
              <path d="M60.58,52.91,74.86,28.22l9.71,24.56-4.76,5.86c-1,.7-2.94,3.85-4.7,8H19.22V61.83l6-.29L31.12,47l3,10.41H43l7.74-19.93,9.82,15.47ZM10.82,0h83.7a10.86,10.86,0,0,1,10.82,10.82V27.48L99.78,34l-1.21,1.49V11.78a4.08,4.08,0,0,0-4-4H11.78a4.08,4.08,0,0,0-4,4V70.39a4.08,4.08,0,0,0,4,4H72.13a46.38,46.38,0,0,0-1,7.23l-.07.51H10.82A10.86,10.86,0,0,1,0,71.35V10.82A10.86,10.86,0,0,1,10.82,0ZM97.53,78.86,82.29,82.47,84,66.07,97.53,78.86ZM88.68,61l20-22.16a1.44,1.44,0,0,1,1-.5,1.39,1.39,0,0,1,.72.17l12.07,11a1.26,1.26,0,0,1,.39.87,1.23,1.23,0,0,1-.42,1L102.2,73.77,88.66,61ZM30.53,22.27a7.14,7.14,0,1,1-7.14,7.14,7.14,7.14,0,0,1,7.14-7.14Z" />
            </svg>
          </button>

          <div className="profile-field" style={{ marginTop: "10px",scale: "1.3" ,marginBottom: "50px"}}>
            <strong style={{marginRight:"6px"}}>Name:</strong>
            {isEditingName ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyPress={(e) => e.key === "Enter" && handleNameBlur()}
                autoFocus
              />
            ) : (
              <>
                {displayName || "User"}
                <button
                  className="edit-btn"
                  onClick={() => setIsEditingName(true)}
                >
                 <MdEdit  />
                </button>
              </>
            )}
          </div>
          <div className="profile-field">
            <strong style={{marginRight:"6px"}}>Username:</strong> {username}
          </div>

          <div className="profile-field">
            <strong style={{marginRight:"6px"}}>Email:</strong>
            {isEditingEmail ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                onKeyPress={(e) => e.key === "Enter" && handleEmailBlur()}
                autoFocus
              />
            ) : (
              <>
                {email || "noemail@example.com"}
                <button
                  className="edit-btn"
                  onClick={() => setIsEditingEmail(true)}
                >
                  <MdEdit  />
                </button>
              </>
            )}
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

          {error && <div className="profile-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}
