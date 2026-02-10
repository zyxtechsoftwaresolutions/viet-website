import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import App from './App.tsx'
import IntroVideo from './components/IntroVideo'
import { introVideoSettingsAPI } from './lib/api'
import './index.css'

const INTRO_COMPLETE_EVENT = 'introComplete';

function Root() {
  const [introDone, setIntroDone] = useState(false);
  const [enableIntroVideo, setEnableIntroVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await introVideoSettingsAPI.get();
        const enabled = settings.is_enabled && !!settings.video_url;
        setEnableIntroVideo(enabled);
        if (!enabled) {
          setIntroDone(true);
        }
      } catch (err) {
        console.error('Failed to fetch intro video settings:', err);
        setEnableIntroVideo(false);
        setIntroDone(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleIntroComplete = () => {
    setIntroDone(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent(INTRO_COMPLETE_EVENT));
      });
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <div className={introDone ? undefined : 'invisible overflow-hidden'}>
        <App />
      </div>
      {enableIntroVideo && !introDone && (
        <IntroVideo onComplete={handleIntroComplete} />
      )}
    </>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
