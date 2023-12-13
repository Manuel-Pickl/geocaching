import React, { useState } from 'react';
import "./CheckboxList.scss"
import { Geocache } from '../../../types/Geocache';

interface CheckboxListProps
{
  geocaches: Geocache[];
  setGeocaches: (value: Geocache[]) => void;
}

function CheckboxList({geocaches, setGeocaches }: CheckboxListProps)
{
  const [listVisible, setListVisible] = useState<boolean>(true);

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void
  {
    const geocacheName = event.target.name;
    const geocache: Geocache | undefined = geocaches.find(geocache => geocache.name === geocacheName);
    if (!geocache)
    {
        return;
    }

    geocache.found = !geocache.found;
    geocache.time = geocache.found 
      ? new Date().toISOString()
      : "";

    setGeocaches([...geocaches]);
  };

  return (
    <div className="checkboxList">
      <div>
        <button onClick={() => {setListVisible(!listVisible)}}>
          debug geocaches
        </button>
        {listVisible && (
          <ul>
            {geocaches?.map((geocache, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    name={geocache.name}
                    checked={geocache.found}
                    onChange={onChange}
                  />
                  <span>{geocache.name}</span>
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