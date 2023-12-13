export class PermissionManager
{
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
     * Initializes the watch on the user's GPS.
     * When debug is false, the userPosition gets updated with the current GPS.
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