/**
 * Reads out the specified message using the Speech Synthesis API.
 *
 * @param {string} message - The text message to be read out loud.
 * @returns {void}
 */
export function read(message: string): void
{
    const speechSynthesis: SpeechSynthesis = window.speechSynthesis;
    const speechSynthesisUtterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(message);
    speechSynthesisUtterance.lang = 'de-DE';

    speechSynthesis.speak(speechSynthesisUtterance);
}