import React, { useState } from 'react';
import "./FindGeocacheList.scss"
import { Geocache } from '../../../types/Geocache';
import { GeocacheStatus } from '../../../types/GeocacheStatus';

/**
 * Props for FindGeocacheList component.
 */
interface FindGeocacheListProps
{
  geocaches: Geocache[];
  setGeocaches: (value: Geocache[]) => void;
  onGeocacheFound: (geocacheName: string) => void;
  setCurrentGeocache: (value: Geocache) => void;
}

/**
 * A component that renders a list of geocaches.
 * It allows users to mark geocaches as found and toggle the visibility of the list.
 *
 * @param props - Props for FindGeocacheList component.
 * @component
 */
function FindGeocacheList({geocaches, setGeocaches, onGeocacheFound, setCurrentGeocache }: FindGeocacheListProps)
{
  const [listVisible, setListVisible] = useState<boolean>(true);

  /**
   * Handles change events on the checkbox inputs.
   * Updates the found status of geocaches.
   *
   * @param event - The change event from the checkbox input.
   */
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
      geocache.geocacheStatus = GeocacheStatus.Removed;

      setCurrentGeocache(geocache);
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