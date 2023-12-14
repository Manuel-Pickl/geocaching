/**
 * Handles all operations relating permissions.
 */
export class PermissionManager
{
    /**
     * Requests 'GPS' permission and initializes a location watcher.
     *
     * @param {function} setUserPosition - Callback function to set the user's position.
     * @param {boolean} debug - Indicates whether debugging is enabled.
     * @returns {void}
     */
    public static requestPermissionGPS(
        setUserPosition: (value: [number, number]) => void,
        debug: boolean
    ): void
    {
        if (!('geolocation' in navigator))
        {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            () => { 
            console.log("'GPS' permission granted")
            this.initializeLocationWatcher(setUserPosition, debug);
            },
            () => { console.log("'GPS' permission denied") },
        );
    }

    /**
     * Initializes a location watcher using the Geolocation API.
     *
     * @param {function} setUserPosition - Callback function to set the user's position.
     * @param {boolean} debug - Indicates whether debugging is enabled.
     * @returns {void}
     */
    private static initializeLocationWatcher(
        setUserPosition: (value: [number, number]) => void,
        debug: boolean
    ): void
    {
        navigator.geolocation.watchPosition((position: GeolocationPosition) =>
        {
            if (debug)
            {
                return;
            }
            
            setUserPosition([position.coords.latitude, position.coords.longitude])
        });
    };
}