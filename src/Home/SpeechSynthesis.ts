export const read = (message: string) => {
    const speechSynthesis: SpeechSynthesis = window.speechSynthesis;
    const speechSynthesisUtterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(message);
    speechSynthesisUtterance.lang = 'de-DE';

    speechSynthesis.speak(speechSynthesisUtterance);
}