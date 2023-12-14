/**
 * Provides time-related operations.
 */
export class TimeManager
{
    /**
     * Converts an ISO-formatted time string to a local date and time string.
     *
     * @param {string} isoTime - The ISO-formatted time string to be converted.
     * @returns {string} - The local date and time string.
     */
    public static isoToLocal(isoTime: string): string
    {
        if (isoTime == "")
        {
            return isoTime;
        }
        
        const localTime = new Date(isoTime).toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
        });

        return localTime;
    }
}