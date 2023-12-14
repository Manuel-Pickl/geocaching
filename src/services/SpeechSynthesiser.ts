/**
 * Provides functionality for speech synthesis
 */
export class SpeechSynthesiser
{
    /**
     * Reads out the specified message using the Speech Synthesis API.
     *
     * @param {string} message - The text message to be read out loud.
     * @returns {void}
     */
    public static read(message: string): void
    {
        const speechSynthesis: SpeechSynthesis = window.speechSynthesis;
        const speechSynthesisUtterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(message);
        speechSynthesisUtterance.lang = 'de-DE';
    
        speechSynthesis.speak(speechSynthesisUtterance);
    }
}