import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import background from "./images/background.png"; // Background image
import eventmap from "./images/mapp.png"; // Event map image
import Zeniva from "./zeniva"; // Import the Zeniva component
import { stalls, graph } from "./stalls"; // Import stalls and graph for points

function App() {
  const canvasRef = useRef(null);
  const [selectedStall, setSelectedStall] = useState("");
  const [paths, setPaths] = useState([]); // To store the dynamically created paths

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load the event map background
    const image = new Image();
    image.src = eventmap;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Mark the red and blue points (stalls and pegs)
      markStallsAndPegs(ctx);
      drawPaths(ctx); // Draw the dynamic paths if any
    };
  }, [paths]);

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
      } else {
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText(stall.label, stall.coords.x + 10, stall.coords.y - 10);
      }
    });
  };

  const drawPaths = (ctx) => {
    if (paths.length === 0) return;

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    paths.forEach((path) => {
      ctx.beginPath();
      ctx.moveTo(path.from.x, path.from.y);
      ctx.lineTo(path.to.x, path.to.y);
      ctx.stroke();
    });
  };

  const handleStallSelection = (e) => {
    const selected = e.target.value;
    setSelectedStall(selected);
    calculatePaths(selected);
  };

  const calculatePaths = (selected) => {
    const newPaths = [];
    const path = findPathUsingGraph("Start", selected);

    path.forEach((node, index) => {
      if (index < path.length - 1) {
        const from = stalls.find((stall) => stall.label === node).coords;
        const to = stalls.find((stall) => stall.label === path[index + 1]).coords;
        newPaths.push({ from, to });
      }
    });

    setPaths(newPaths);
  };

  const findPathUsingGraph = (startNode, endNode) => {
    const queue = [[startNode]];
    const visited = new Set();

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      if (node === endNode) {
        return path;
      }

      if (!visited.has(node)) {
        visited.add(node);

        const neighbors = graph[node];

        if (neighbors && Array.isArray(neighbors)) {
          neighbors.forEach((neighbor) => {
            const newPath = [...path, neighbor];
            queue.push(newPath);
          });
        }
      }
    }
    return null; // No path found
  };

  return (
    <div className="app-container">
      <div className="image-container">
        {/* Background image */}
        <img src={background} alt="Map" className="background-image" />

        {/* Event map canvas */}
        <canvas ref={canvasRef} width={1000} height={1575} className="eventmap-canvas" />

        {/* Zeniva circular component positioned on top */}
        <div className="zeniva">
          <Zeniva />
        </div>

        {/* Dropdown to select a stall */}
        <div className="dropdown-container" style={{ position: "absolute", top: 10, left: 10 }}>
          <select onChange={handleStallSelection} value={selectedStall}>
            <option value="">-- Select Stall --</option>
            {(stalls || [])
              .filter((stall) => !stall.label.startsWith("Peg")) // Only show red points (stalls)
              .map((stall) => (
                <option key={stall.label} value={stall.label}>
                  {stall.label}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
