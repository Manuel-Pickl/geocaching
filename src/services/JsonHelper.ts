export const serialize = (key: string, value: any) => {
    try {
        const dataToSerialize = JSON.stringify(value);
        localStorage.setItem(key, dataToSerialize);
    } catch (error) {
        console.error(`Error serializing ${key}:\n`, error);
    }
};

export const deserialize = (key: string): any => {
    try {
        const dataToDeserialize = localStorage.getItem(key);
        if (dataToDeserialize === null) {
            return null;
        }
        return JSON.parse(dataToDeserialize);
    } catch (error) {
        console.error(`Error deserializing ${key}:\n`, error);
          return null;
    }
};