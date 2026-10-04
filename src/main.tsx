import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { startBackgroundRuntime } from './store/backgroundRuntime';

if (typeof window !== 'undefined') {
  startBackgroundRuntime();
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    });
  }
}

createRoot(document.getElementById('root')!).render(<App />);
