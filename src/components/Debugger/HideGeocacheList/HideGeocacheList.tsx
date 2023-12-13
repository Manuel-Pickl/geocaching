import { useRef, useState } from 'react';
import "./HideGeocacheList.scss"
import { Geocache } from '../../../types/Geocache';
import { GeocacheManager } from '../../../services/GeocacheManager';

interface HideGeocacheListProps
{
  geocaches: Geocache[];
  setGeocaches: (value: Geocache[]) => void;
  onGeocacheHidden: (geocacheName: string) => void;
  geocacheManager: GeocacheManager;
}

function HideGeocacheList({geocaches, setGeocaches, onGeocacheHidden, geocacheManager }: HideGeocacheListProps)
{
  const [listVisible, setListVisible] = useState<boolean>(true);
  const [newGeocache, setNewGeocache] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  function add(): void
  {
    onGeocacheHidden(newGeocache);
    setNewGeocache("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function remove(geocacheName: string): void
  {
    const geocache: Geocache | undefined = geocacheManager.getGeocacheByName(geocacheName, geocaches);
    if (!geocache)
    {
      return;
    }

    setGeocaches(geocaches.filter(x => x !== geocache));
  }

  function addIsDisabled(): boolean
  {
      const nameIsEmpty: boolean = newGeocache.trim().length === 0;
      const nameIsAlreadyTaken: boolean = geocacheManager.geocacheExists(newGeocache, geocaches);

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
                ref={inputRef}
                type="text"
                placeholder="Enter geocache name"
                value={newGeocache}
                maxLength={10}
                onChange={(e) => setNewGeocache(e.target.value)}
              />
              <button
                onClick={add}
                disabled={addIsDisabled()}
              >
                Add
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