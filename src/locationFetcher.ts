import { useEffect, useState } from 'react';

const debugMovement = 0.0001;

const getUserPosition = (
  debug = false,
  direction = [0, 0],
  permissionLocationAllowed = false) => 
{
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setUserPosition([latitude, longitude]);
    };

    const updatePosition = () => {
      if (debug) {
        setUserPosition(prevPosition => {
          if (!prevPosition) {
            const mapCenter: [number, number] = [49.43306480206603, 11.86834899582829];
            prevPosition = mapCenter;
          }

          const [prevLatitude, prevLongitude] = prevPosition;
          return [prevLatitude + direction[0] * debugMovement, prevLongitude + direction[1] * debugMovement];
        });
      } else {
        if (!permissionLocationAllowed) {
          return;
        }
        
        navigator.geolocation.getCurrentPosition(successCallback);
      }
    };

    if (!debug) {
      const watchId = navigator.geolocation.watchPosition(successCallback);
      return () => navigator.geolocation.clearWatch(watchId);
    }

    const intervalId = setInterval(updatePosition, 200);
    return () => clearInterval(intervalId);
  }, [debug, direction]);

  return userPosition;
};

export default getUserPosition;
