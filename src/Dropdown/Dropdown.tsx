import React, { useState } from 'react';
import './Dropdown.css';
import { GeoPoint } from '../GeoPoint';

interface DropdownProps {
  geoPoints: GeoPoint[];
  onSelectChange: (geoPoint: GeoPoint) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ geoPoints, onSelectChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const geoPoint: GeoPoint | undefined = geoPoints?.find((x) => x.name === selectedValue);
    
    if (geoPoint) {
      onSelectChange(geoPoint);
      setSelectedOption('');
    }
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
