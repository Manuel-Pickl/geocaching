/**
 * Represents a function result.
 * It holds information about the result of the operation and the result message.
 */
export class Result
{
    success: boolean;
    message: string;
  
    constructor(success: boolean, message: string)
    {
        this.success = success;
        this.message = message;
    }
}