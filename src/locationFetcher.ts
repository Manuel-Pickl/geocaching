import { useEffect, useState } from 'react';

const updateInterval: number = 200;
const debugMovement: number = 0.0001;
var latitude: number = 49.4169693;
var longitude: number = 11.8820955;

const userPosition = (debug: boolean, direction: [number, number]) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  
  useEffect(() => {
    const getUserPosition = () => {
      if (debug) {
        latitude += direction[0] * debugMovement;
        longitude += direction[1] * debugMovement;
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
          }
        );
      }

      setUserPosition([latitude, longitude]);
    };

    const intervalId = setInterval(() => {
      getUserPosition();
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [debug, direction, updateInterval]);

  return userPosition;
};

export default userPosition;
