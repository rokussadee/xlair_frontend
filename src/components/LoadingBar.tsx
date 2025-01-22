import React from 'react';
import '../LoadingBar.css'; // Import the CSS file for the styles

interface LoadingBarProps {
  width?: string; // Optional: Specify width as a percentage, fixed width (e.g., "50px"), or let it default to 100%.
  color?: string; // Optional: The color of the loading bar.
  speed?: string; // Optional: The speed of the animation.
  stroke?: string; // Optional: The thickness of the bar.
  bgOpacity?: number; // Optional: The opacity of the background bar.
}

const LoadingBar: React.FC<LoadingBarProps> = ({
  width = '100%', // Default width is 100% of the parent container
  color = 'black',
  speed = '1.4s',
  stroke = '5px',
  bgOpacity = 0.1,
}) => {
  return (
    <div
      className="loading-bar-container"
      style={{
        '--uib-size': width,
        '--uib-color': color,
        '--uib-speed': speed,
        '--uib-stroke': stroke,
        '--uib-bg-opacity': bgOpacity,
      } as React.CSSProperties}
    ></div>
  );
};

export default LoadingBar;



