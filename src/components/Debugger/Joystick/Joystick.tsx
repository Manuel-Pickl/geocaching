import { useEffect } from 'react';
import "./Joystick.scss";
import { Direction } from '../../../types/Direction';

/**
 * Props for the Joystick component.
 */
interface JoystickProps
{
  userPosition: [number, number] | null;
  setUserPosition: (value: [number, number]) => void;
}

/**
 * A component that represents a joystick for moving a user's position.
 * It allows the user to move in four directions: Up, Down, Left, Right.
 *
 * @param props - Props for the Joystick component.
 * @component
 */
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

  /**
   * Returns the arrow symbol for a given direction.
   * 
   * @param direction - The direction for which to get the symbol.
   * @returns string - The arrow symbol.
   */
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

  /**
   * Handles the click on an arrow button, updating the user's position based on the direction.
   * 
   * @param direction - The direction in which to move the user's position.
   */
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