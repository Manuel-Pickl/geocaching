/**
 * Handles all operations relating permissions.
 */
export class PermissionManager
{
    /**
     * Requests 'GPS' permission and initializes a location watcher.
     *
     * @param {function} updateUserPosition - Callback function to update the user's position.
     * @returns {void}
     */
    public static requestPermissionGPS(
        updateUserPosition: (value: [number, number]) => void,
    ): void
    {
        if (!('geolocation' in navigator))
        {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            () => { 
            console.log("'GPS' permission granted")
            this.initializeLocationWatcher(updateUserPosition);
            },
            () => { console.log("'GPS' permission denied") },
        );
    }

    /**
     * Initializes a location watcher using the Geolocation API.
     *
     * @param {function} updateUserPosition - Callback function to update the user's position.
     * @returns {void}
     */
    private static initializeLocationWatcher(
        updateUserPosition: (value: [number, number]) => void,
    ): void
    {
        navigator.geolocation.watchPosition((position: GeolocationPosition) =>
        {
            updateUserPosition([position.coords.latitude, position.coords.longitude])
        });
    };
}