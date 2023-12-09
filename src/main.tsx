import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import './services/fontawesome.js';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/serviceworker.js')
        .then((registration) => {
            console.log(`Service Worker registered with scope: ${registration.scope}`);
            alert(`Service Worker registered with scope: ${registration.scope}`);
        })
        .catch((error) => {
            console.error(`Service Worker registration failed: ${error}`);
            alert(`Service Worker registration failed: ${error}`);
        });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)
