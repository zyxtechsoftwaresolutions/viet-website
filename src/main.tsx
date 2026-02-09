import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import App from './App.tsx'
import IntroVideo from './components/IntroVideo'
import './index.css'

const INTRO_COMPLETE_EVENT = 'introComplete';
const ENABLE_INTRO_VIDEO = false; // Temporarily disable intro video

function Root() {
  const [introDone, setIntroDone] = useState(!ENABLE_INTRO_VIDEO);

  const handleIntroComplete = () => {
    setIntroDone(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent(INTRO_COMPLETE_EVENT));
      });
    });
  };

  return (
    <>
      <div className={introDone ? undefined : 'invisible overflow-hidden'}>
        <App />
      </div>
      {ENABLE_INTRO_VIDEO && !introDone && (
        <IntroVideo onComplete={handleIntroComplete} />
      )}
    </>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
