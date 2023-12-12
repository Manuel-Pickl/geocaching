export function read(message: string): void
{
    const speechSynthesis: SpeechSynthesis = window.speechSynthesis;
    const speechSynthesisUtterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(message);
    speechSynthesisUtterance.lang = 'de-DE';

    speechSynthesis.speak(speechSynthesisUtterance);
}