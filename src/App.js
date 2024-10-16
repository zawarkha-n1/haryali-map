import React from "react";
import "./App.css";
import background from "./images/background.png"; // Background image
import eventmap from "./images/eventmap.png"; // Event map image
import Zeniva from "./zeniva"; // Import the Zeniva component

function App() {
  return (
    <div className="app-container">
      <div className="image-container">
        {/* Background image */}
        <img src={background} alt="Map" className="background-image" />

        {/* Event map image positioned on top */}
        <img src={eventmap} alt="Event Map" className="eventmap-image" />

        Zeniva circular component positioned on top
        <div className="zeniva">
          <Zeniva />
        </div>
      </div>
    </div>
  );
}

export default App;
