import { useState } from 'react';
import "./HideGeocacheList.scss"
import { Geocache } from '../../../types/Geocache';
import { GeocacheManager } from '../../../services/GeocacheManager';
import { GeocacheStatus } from '../../../types/GeocacheStatus';

/**
 * Props for HideGeocacheList component.
 */
interface HideGeocacheListProps
{
  geocaches: Geocache[];
  setGeocaches: (value: Geocache[]) => void;
  onGeocacheHidden: (geocacheName: string) => void;
}

/**
 * A component that renders a list of geocaches to be hidden.
 * It allows users to add new geocaches to the list and remove existing ones.
 *
 * @param props - Props for HideGeocacheList component.
 * @component
 */
function HideGeocacheList({geocaches, setGeocaches, onGeocacheHidden }: HideGeocacheListProps)
{
  const [listVisible, setListVisible] = useState<boolean>(true);
  const [newGeocache, setNewGeocache] = useState<string>('');

  /**
   * Handles the addition of a new geocache.
   */
  function add(): void
  {
    onGeocacheHidden(newGeocache);
    setNewGeocache("");
  }

  /**
   * Handles the removal of an existing geocache.
   * 
   * @param geocacheName - The name of the geocache to be removed.
   */
  function remove(geocacheName: string): void
  {
    const geocache: Geocache | undefined = GeocacheManager.getGeocacheByName(geocacheName, geocaches);
    if (!geocache)
    {
      return;
    }

    geocache.geocacheStatus = GeocacheStatus.Removed;
    setGeocaches([...geocaches]);

    // we have to wait, so the first setGeocaches gets executed
    setTimeout(() => 
      setGeocaches(geocaches.filter(x => x !== geocache))
    , 100)
  }

  /**
   * Determines if the add button should be disabled.
   * 
   * @returns boolean - Returns true if the name is empty or already taken.
   */
  function addIsDisabled(): boolean
  {
      const nameIsEmpty: boolean = newGeocache.trim().length === 0;
      const nameIsAlreadyTaken: boolean = GeocacheManager.geocacheExists(newGeocache, geocaches);

      return nameIsEmpty || nameIsAlreadyTaken;
  }

  return (
    <div className="hideGeocacheList">
      <div>
        <button onClick={() => {setListVisible(!listVisible)}}>
          hide geocaches ▼
        </button>

        {listVisible && (
          <>
            <div>
              <input
                type="text"
                placeholder="geocache name"
                value={newGeocache}
                maxLength={10}
                onChange={(e) => setNewGeocache(e.target.value)}
              />

              <button
                onClick={add}
                disabled={addIsDisabled()}
              >
                +
              </button>
            </div>
            
            <ul>
              {geocaches.map((geocache, index) => (
                <li key={index}>
                  {geocache.name}
                  <button onClick={() => remove(geocache.name)}>X</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default HideGeocacheList;