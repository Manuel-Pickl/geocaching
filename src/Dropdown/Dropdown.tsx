import React, { useState } from 'react';
import { GeoPoint } from '../GeoPoint';

interface DropdownProps {
  geoPoints: GeoPoint[];
  onSelectionChanged: (geoPointName: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ geoPoints, onSelectionChanged }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const geoPointName = event.target.value;

    onSelectionChanged(geoPointName);
    setSelectedOption('');
  };

  return (
    <>
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="" disabled>
          debug geopoints
        </option>
        {geoPoints?.map((geoPoint, index) => (
          <option
            key={index}
            value={geoPoint.name}
            style={{ backgroundColor: geoPoint.found ? 'lightgreen' : 'lightcoral' }}
          >
            {geoPoint.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default Dropdown;