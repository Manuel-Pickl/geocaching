// Joystick.jsx

import React from 'react';
import { Direction } from '../../Direction';
import "./Joystick.scss";

interface JoystickProps {
  setDirection: (value: [number, number]) => void;
}

const Joystick: React.FC<JoystickProps> = ({ setDirection }) => {
  const directions = [
    Direction.Up,
    Direction.Left,
    Direction.Right,
    Direction.Down
  ];

  const handleArrowClick = (direction: Direction) => {
    switch (direction) {
      case Direction.Up:
        setDirection([1, 0]);
        break;
      case Direction.Right:
        setDirection([0, 1]);
        break;
      case Direction.Down:
        setDirection([-1, 0]);
        break;
      case Direction.Left:
        setDirection([0, -1]);
        break;
    }
  };

  const handleArrowRelease = () => {
    setDirection([0, 0]);
  };

  return (
    <div className="joystick">
      {directions.map((direction, index) => (
        <div
          key={index}
          className={`button ${Direction[direction]}`}
          onMouseDown={() => handleArrowClick(direction)}
          onMouseUp={handleArrowRelease}
          onTouchStart={() => handleArrowClick(direction)}
          onTouchEnd={handleArrowRelease}
        >
          {getArrowSymbol(direction)}
        </div>
      ))}
    </div>
  );
};

const getArrowSymbol = (direction: Direction) => {
  switch (direction) {
    case Direction.Up:
      return '↑';
    case Direction.Right:
      return '→';
    case Direction.Down:
      return '↓';
    case Direction.Left:
      return '←';
    default:
      return '';
  }
};

export default Joystick;