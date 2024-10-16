import React, { useEffect, useRef } from "react";
import "./App.css";
import background from "./images/background.png"; // Background image
import eventmap from "./images/mapp.png"; // Event map image
import Zeniva from "./zeniva"; // Import the Zeniva component
import { stalls, graph } from "./stalls"; // Import stalls and graph for points

function App() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load the event map background image onto the canvas
    const image = new Image();
    image.src = eventmap;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Mark the red and blue points (stalls and pegs)
      markStallsAndPegs(ctx);
    };
  }, []);

  // Function to mark red and blue points for stalls and pegs
  const markStallsAndPegs = (ctx) => {
    stalls.forEach((stall) => {
      ctx.fillStyle = stall.label.startsWith("Peg") ? "blue" : "red"; // Pegs in blue, stalls in red
      const radius = stall.label.startsWith("Peg") ? 6 : 3; // Bigger circles for pegs
      ctx.beginPath();
      ctx.arc(stall.coords.x, stall.coords.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Label the stall (if it's not a Peg)
      if (!stall.label.startsWith("Peg")) {
        ctx.fillStyle = "black";
        ctx.font = "8px Arial";
        ctx.fillText(stall.label, stall.coords.x + 10, stall.coords.y - 10);
      }
      else{
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText(stall.label, stall.coords.x + 10, stall.coords.y - 10);
      }
    });
  };


  

  return (
    <div className="app-container">
      <div className="image-container">
        {/* Background image */}
        <img src={background} alt="Map" className="background-image" />

        {/* Event map canvas - replacing the <img> */}
        <canvas ref={canvasRef} width={1000} height={1575} className="eventmap-canvas" />

        {/* Zeniva circular component positioned on top */}
        <div className="zeniva">
          <Zeniva />
        </div>
      </div>
    </div>
  );
}

export default App;
