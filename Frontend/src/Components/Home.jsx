import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Nav from "./Nav";
import Video from "../assets/bg-video3.mp4";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Gamevideo from "../assets/bg-video5.mp4";

import Fadeclick from "../assets/gamelogo/fadeclick.jpg";
import Hoppinggame from "../assets/gamelogo/hop.jpg";
import Colorhunt from "../assets/gamelogo/colorhunt.jpg";
import Memorycard from "../assets/gamelogo/memory.jpg";
import Racing from "../assets/gamelogo/racing.jpg";
import Snake from "../assets/gamelogo/snake.jpg";
import Ladder from "../assets/gamelogo/snakeladder.jpg";
import stickman from "../assets/gamelogo/stickman.jpg";
import block from "../assets/gamelogo/block.png";

export default function Home() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState("/default-profile.png");
  const [profileKey, setProfileKey] = useState(0);
  const [name, setName] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const bottomRef = useRef(null);
  const autoScrollInterval = useRef(null);
  const scrollAmount = 300;

  const username = localStorage.getItem("username") || sessionStorage.getItem("username");

  const refreshProfile = () => {
    setProfileKey((prev) => prev + 1);
  };

  useEffect(() => {
    const storedName = localStorage.getItem("name") || sessionStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token || !username) {
      navigate("/");
      return;
    }

    const loadProfile = async () => {
      try {
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
          if (data.photo_url) {
            setPhoto(data.photo_url);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    loadProfile();
  }, [navigate, profileKey, username]);

  useEffect(() => {
    autoScrollInterval.current = setInterval(() => {
      const container = bottomRef.current;
      if (!container) return;

      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(autoScrollInterval.current);
  }, []);

  const scrollLeft = () => {
    bottomRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    bottomRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const game_box = [
    { id: 1, name: "Color Hunt", image: Colorhunt, description: "Quickly find and click the correct color tile from a grid before time runs out. The faster you are, the higher your score!", link: "/mygames/colour.html", video: Gamevideo },
    { id: 2, name: "Hop Dash", image: Hoppinggame, description: "Guide your character across platforms by timing your hops perfectly. Keep up the momentum as speed increases.", link: "/mygames/hoppinggame.html", video: Gamevideo },
    { id: 3, name: "Mind Match", image: Memorycard, description: "Flip cards and find all matching pairs with the fewest moves. Great for all ages — test your memory!", link: "/mygames/memorycard.html", video: Gamevideo },
    { id: 4, name: "Speed Rush", image: Racing, description: "Race through tracks, dodge obstacles, and reach the finish line first. Test your reflexes!", link: "/mygames/race.html", video: Gamevideo },
    { id: 5, name: "Fade Click", image: Fadeclick, description: "Colors appear and vanish — can you click them in time? Stay sharp!", link: "/mygames/reaction.html", video: Gamevideo },
    { id: 6, name: "Pixel Snake", image: Snake, description: "Eat and grow your snake — but don’t crash! Classic arcade fun.", link: "/mygames/snake.html", video: Gamevideo },
    { id: 7, name: "Snake & Ladder", image: Ladder, description: "Climb ladders, avoid snakes. Classic game of chance and strategy.", link: "/mygames/snakeladder.html", video: Gamevideo },
    { id: 8, name: "Block Master", image: block, description: "Fit falling blocks and clear rows before they stack up. Tetris-style fun!", link: "/mygames/tetris.html", video: Gamevideo },
    { id: 9, name: "Stickman Sprint", image: stickman, description: "Run, jump, and dodge obstacles as fast as you can. Can you keep up?", link: "/mygames/stickman/stickman.html", video: Gamevideo },
  ];

  return (
    <section id="home">
      <Nav photo={photo} refreshProfile={refreshProfile} />
      <div className="content">
        <div className="top">
          <div className="game-display">
            <video
              src={selectedGame ? selectedGame.video : Video}
              autoPlay
              loop
              muted
            />
            <div className="game-data">
              <div className="left">
                <h1>{selectedGame ? selectedGame.name : name ? `Welcome ${name},` : "Welcome"}</h1>
                <p>
                  {selectedGame
                    ? selectedGame.description
                    : "Explore a collection of mini-games for quick challenges and fun. No installs, just pure gameplay. Ready to beat the high scores?"}
                </p>
              </div>
              {selectedGame && (
                <div className="right">
                  <button onClick={() => window.open(selectedGame.link, "_self")}>
                    Play
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bottom-container">
          <button className="scroll-button left" onClick={scrollLeft}>
            <FaArrowLeft />
          </button>
          <div className="bottom" ref={bottomRef}>
            {game_box.map((game) => (
              <div
                key={game.id}
                className="game-box"
                onClick={() => setSelectedGame(game)}
              >
                <img src={game.image} alt={game.name} />
                <div className="game-title">{game.name}</div>
              </div>
            ))}
          </div>
          <button className="scroll-button right" onClick={scrollRight}>
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
