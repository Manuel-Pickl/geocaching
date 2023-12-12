import { useEffect } from 'react';
import "./Joystick.scss";
import { Direction } from '../../../types/Direction';

interface JoystickProps
{
  userPosition: [number, number] | null;
  setUserPosition: (value: [number, number]) => void;
}

function Joystick({ userPosition, setUserPosition }: JoystickProps)
{
  const debugMovement = 0.0001;
  const directions = [
    Direction.Up,
    Direction.Left,
    Direction.Right,
    Direction.Down
  ];

  useEffect(() =>
  {
    if (userPosition)
    {
      return;
    }

    setUserPosition([49.43306480206603, 11.86834899582829]);
  }, []);

  function getArrowSymbol(direction: Direction): string
  {
    switch (direction)
    {
      case Direction.Up:
        return "↑";
      case Direction.Right:
        return "→";
      case Direction.Down:
        return "↓";
      case Direction.Left:
        return "←";
      default:
        return "";
    }
  };

  function handleArrowClick(direction: Direction): void
  {
    if (!userPosition)
    {
      return;
    }

    const currentLatitude = userPosition[0];
    const currentLongitude = userPosition[1];

    switch (direction)
    {
      case Direction.Up:
        setUserPosition([currentLatitude + debugMovement, currentLongitude]);
        break;
      case Direction.Down:
        setUserPosition([currentLatitude - debugMovement, currentLongitude]);
        break;
      case Direction.Right:
          setUserPosition([currentLatitude, currentLongitude + debugMovement]);
          break;
      case Direction.Left:
        setUserPosition([currentLatitude, currentLongitude - debugMovement]);
        break;
    }
  };

  return (
    <div className="joystick">
      {directions.map((direction, index) => (
        <div
          key={index}
          className={`button ${Direction[direction]}`}
          onClick={() => handleArrowClick(direction)}
        >
          {getArrowSymbol(direction)}
        </div>
      ))}
    </div>
  );
};

export default Joystick;