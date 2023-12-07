import React, { useState } from 'react';
import "./CheckboxList.scss"
import { GeoPointManager } from '../../../services/GeoPointManager';
import { GeoPoint } from '../../../types/GeoPoint';

interface CheckboxListProps {
  geoPointManager: GeoPointManager;
  geoPoints: GeoPoint[];
  setGeoPoints: (value: GeoPoint[]) => void;
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  geoPoints,
  setGeoPoints
}) => {
  const [listVisible, setListVisible] = useState<boolean>(true);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const geoPointName = event.target.name;
    const geoPoint: GeoPoint | undefined = geoPoints.find(x => x.name === geoPointName);
    if (!geoPoint) {
        return false;
    }

    geoPoint.found = !geoPoint.found;
    geoPoint.time = geoPoint.found 
      ? new Date().toLocaleDateString('de-DE')
      : "";

    setGeoPoints([...geoPoints]);
  };

  return (
    <div className="checkboxList">
      <div>
        <button onClick={() => {setListVisible(!listVisible)}}>
          debug geopoints
        </button>
        {listVisible && (
          <ul>
            {geoPoints?.map((geoPoint, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    name={geoPoint.name}
                    checked={geoPoint.found}
                    onChange={onChange}
                  />
                  <span>{geoPoint.name}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CheckboxList;
