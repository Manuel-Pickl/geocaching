import React, { useState } from 'react';
import "./FindGeocacheList.scss"
import { Geocache } from '../../../types/Geocache';

interface FindGeocacheListProps
{
  geocaches: Geocache[];
  setGeocaches: (value: Geocache[]) => void;
  onGeocacheFound: (geocacheName: string) => void;
}

function FindGeocacheList({geocaches, setGeocaches, onGeocacheFound }: FindGeocacheListProps)
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

    if (geocache.found)
    {
      geocache.found = !geocache.found;
      geocache.time = geocache.found 
        ? new Date().toISOString()
        : "";
  
      setGeocaches([...geocaches]);
    }
    else
    {
      onGeocacheFound(geocacheName);
    }
  };

  return (
    <div className="findGeocacheList">
      <div>
        <button onClick={() => {setListVisible(!listVisible)}}>
          find geocaches ▼
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

export default FindGeocacheList;