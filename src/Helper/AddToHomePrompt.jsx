import { useEffect, useState } from 'react';

export default function AddToHomePrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleAddToHome = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      }
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: 20,
      background: 'white',
      padding: 10,
      borderRadius: 8,
      boxShadow: '0 0 10px rgba(0,0,0,0.2)'
    }}>
      <p>📲 Add Gusto Dakhla to Home Screen?</p>
      <button onClick={handleAddToHome}>Add Now</button>
    </div>
  );
}
