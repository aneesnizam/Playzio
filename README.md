# Playzio Mini Games Website

## Project Overview

Playzio is a web-based mini games platform featuring a collection of fun and engaging games built with multiple technologies. The frontend is primarily developed using **React.js**, complemented by a **Python backend** for handling server-side logic and APIs. Additionally, several mini games are built using separate HTML, CSS, and JavaScript files, integrated into the platform.

---

## Features

- A variety of mini games, each with unique gameplay and mechanics.
- React-powered main interface for seamless navigation and game selection.
- Python backend providing APIs for user data and additional backend logic.
- Separate standalone mini games developed with vanilla HTML, CSS, and JavaScript.
- Responsive and interactive UI with game preview images and descriptions.
- Organized game collection for easy access.

---

## List of Mini Games

| Game ID | Name            | Description                                                                     |
| ------- | --------------- | ------------------------------------------------------------------------------- |
| 1       | Color Hunt      | Quickly find and click the correct color tile from a grid before time runs out. |
| 2       | Hop Dash        | Guide your character across platforms by timing your hops perfectly.            |
| 3       | Mind Match      | Flip cards and find all matching pairs with the fewest moves.                   |
| 4       | Speed Rush      | Race through tracks, dodge obstacles, and reach the finish line first.          |
| 5       | Fade Click      | Colors appear and vanish — click them in time to score points.                  |
| 6       | Pixel Snake     | Classic snake game — eat to grow but avoid crashing.                            |
| 7       | Snake & Ladder  | Classic board game — climb ladders, avoid snakes, and reach the end.            |
| 8       | Block Master    | Tetris-style game — fit falling blocks and clear rows before they stack up.     |
| 9       | Stickman Sprint | Run, jump, and dodge obstacles in this fast-paced endless runner.               |

---

## Tech Stack

- **Frontend:** React.js, HTML, CSS, JavaScript
- **Backend:** Python (Flask or your chosen framework)
- **Games:** Separate standalone HTML/CSS/JS mini games
- **Build & Tooling:** npm/yarn, Python environment

---

## Project Structure

/frontend # React application for main UI and navigation

/backend # Python backend for API and server logic

---

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:

cd Backend

2. Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate # Linux/Mac
.\venv\Scripts\activate # Windows

3. Install dependencies:

pip install -r requirements.txt

4. Run the backend server:

python app.py

### Frontend Setup

1. Navigate to the frontend folder:

cd Frontend

2. Install node modules:

npm install

3. Run the React development server:

npm start

---

## How to Play

1. Open the Playzio React web app in your browser.
2. Login or register
3. Browse through the list of available mini games.
4. Click on a game to open and play it.
5. Enjoy!

---

## API Usage
This project is connected to a hosted backend API for seamless functionality in production. By default, all API requests point to the deployed backend URL. However, for local development or testing purposes, you can switch to a locally hosted API. To do this, update the API base URL in the configuration file or environment variable (depending on the setup) to your local server address (e.g., http://localhost:5000). Make sure your local backend is running before making requests.

---

## License

This project is for personal and educational use.
