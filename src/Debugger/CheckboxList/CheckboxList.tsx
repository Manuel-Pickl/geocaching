import React, { useState } from 'react';
import { GeoPoint } from '../../GeoPoint';
import { GeoPointManager } from '../../GeoPointManager';
import "./CheckboxList.scss"

interface CheckboxListProps {
  geoPointManager: GeoPointManager;
  geoPoints: GeoPoint[];
  setGeoPoints: (value: GeoPoint[]) => void;
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  geoPointManager,
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

    geoPointManager.serialize(geoPoints);
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
