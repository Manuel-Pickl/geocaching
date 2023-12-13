export class TimeManager
{
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