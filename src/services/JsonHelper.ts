/**
 * Handles saving and loading of json files.
 */
export class JsonHelper
{
    /**
     * Serializes the given value under the given key.
     * 
     * @param key - Key for storing the value.
     * @param value - Value, which got saved with the given key.
     */
    public static serialize(key: string, value: any): void
    {
        try
        {
            const dataToSerialize = JSON.stringify(value);
            localStorage.setItem(key, dataToSerialize);
        } catch (error)
        {
            console.error(`Error serializing ${key}:\n`, error);
        }
    };

    /**
     * Deserializes the value under the given key.
     * 
     * @param key - Key for which the values get deserialized.
     * @returns - The deserialized data.
     */
    public static deserialize(key: string): any
    {
        try
        {
            const dataToDeserialize = localStorage.getItem(key);
            if (dataToDeserialize === null)
            {
                return null;
            }
            
            return JSON.parse(dataToDeserialize);
        } catch (error)
        {
            console.error(`Error deserializing ${key}:\n`, error);
            return null;
        }
    };
}