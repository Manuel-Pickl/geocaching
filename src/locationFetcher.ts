import { useEffect, useState } from 'react';

var latitude: number = 49.4169693;
var longitude: number = 11.8820955;
const debug: boolean = true;
const updateInterval: number = 200;

const userPosition = () => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    const getUserPosition = () => {
      if (debug) {
        setUserPosition([latitude, longitude]);
        latitude += 0.0001;
      }
      else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserPosition([latitude, longitude]);
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      }
    };

    // Initial location retrieval
    getUserPosition();

    // Set up interval to update user's location
    const intervalId = setInterval(() => {
      getUserPosition();
    }, updateInterval);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [updateInterval]);

  return userPosition;
};

export default userPosition;
