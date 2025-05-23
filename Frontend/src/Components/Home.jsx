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
  const username =
    localStorage.getItem("username") || sessionStorage.getItem("username");
     const name = localStorage.getItem('name') || sessionStorage.getItem('name');
  const bottomRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const scrollAmount = 300;
  const autoScrollInterval = useRef(null);

  const refreshProfile = () => {
    setProfileKey((prev) => prev + 1);
  };

  useEffect(() => {
    
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token || !username) {
      navigate("/");
    } else {
      const loadProfile = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/user/profile?username=${username}`,
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
    }
  }, [navigate, profileKey, username]);

  const scrollLeft = () => {
    bottomRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    bottomRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // ✅ Auto Scroll
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollInterval.current = setInterval(() => {
        const container = bottomRef.current;
        if (container) {
          if (
            container.scrollLeft + container.clientWidth >=
            container.scrollWidth
          ) {
            // If reached end, scroll back to start
            container.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }
        }
      }, 3000); // scroll every 3 seconds
    };

    startAutoScroll();
    return () => clearInterval(autoScrollInterval.current);
  }, []);

  const game_box = [
    {
      id: 1,
      name: "Color Hunt",
      description:
        "Quickly find and click the correct color tile from a grid before time runs out. The faster you are, the higher your score!",
      image: Colorhunt,
      link: "/mygames/colour.html",
      video: Gamevideo,
    },
    {
      id: 2,
      name: "Hop Dash",
      description:
        "Guide your character across platforms by timing your hops perfectly. Keep up the momentum as speed increases.",
      image: Hoppinggame,
      link: "/mygames/hoppinggame.html",
      video: Gamevideo,
    },
    {
      id: 3,
      name: "Mind Match",
      description:
        "Flip cards and find all matching pairs with the fewest moves. Great for all ages — test your memory!",
      image: Memorycard,
      link: "/mygames/memorycard.html",
      video: Gamevideo,
    },
    {
      id: 4,
      name: "Speed Rush",
      description:
        "Race through tracks, dodge obstacles, and reach the finish line first. Test your reflexes!",
      image: Racing,
      link: "/mygames/race.html",
      video: Gamevideo,
    },
    {
      id: 5,
      name: "Fade Click",
      description:
        "Colors appear and vanish — can you click them in time? Stay sharp!",
      image: Fadeclick,
      link: "/mygames/reaction.html",
      video: Gamevideo,
    },
    {
      id: 6,
      name: "Pixel Snake",
      description:
        "Eat and grow your snake — but don’t crash! Classic arcade fun.",
      image: Snake,
      link: "/mygames/snake.html",
      video: Gamevideo,
    },
    {
      id: 7,
      name: "Snake & Ladder",
      description:
        "Climb ladders, avoid snakes. Classic game of chance and strategy.",
      image: Ladder,
      link: "/mygames/snakeladder.html",
      video: Gamevideo,
    },
    {
      id: 8,
      name: "Block Master",
      description:
        "Fit falling blocks and clear rows before they stack up. Tetris-style fun!",
      image: block,
      link: "/mygames/tetris.html",
      video: Gamevideo,
    },
    {
      id: 9,
      name: "Stickman Sprint",
      description:
        "Run, jump, and dodge obstacles as fast as you can. Can you keep up?",
      image: stickman,
      link: "/mygames/stickman/stickman.html",
      video: Gamevideo,
    },
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
            ></video>
            <div className="game-data">
              <div className="left">
                <h1>{selectedGame ? selectedGame.name : `Welcome  ${name},`}</h1>
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
