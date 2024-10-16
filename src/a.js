import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import background from "./images/background.png"; // Background image
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
    image.src = background;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
      // Mark the red and blue points
      markStallsAndPaths(ctx);
      drawPaths(ctx); // Draw the dynamic paths if any
    };
  }, [paths]);

  const markStallsAndPaths = (ctx) => {
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
        {/* Event map canvas */}
        <canvas ref={canvasRef} width={1000} height={1000} className="eventmap-canvas" />
      </div>

      <div style={{ marginLeft: "20px" }}>
        <h2>Select Stall:</h2>
        <select onChange={handleStallSelection} value={selectedStall}>
          <option value="">--Select--</option>
          {(stalls || []) // Adding a fallback for undefined stalls
            .filter((stall) => stall.label !== "Start" && !stall.label.startsWith("Peg"))
            .map((stall) => (
              <option key={stall.label} value={stall.label}>
                {stall.label}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default App;
