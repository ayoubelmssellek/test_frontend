import { useEffect, useState } from 'react'

function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    })
  }, [])

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted A2HS prompt')
        } else {
          console.log('User dismissed A2HS prompt')
        }
        setDeferredPrompt(null)
        setShow(false)
      })
    }
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      backgroundColor: '#ff5722',
      color: 'white',
      padding: '10px',
      textAlign: 'center',
      zIndex: 1000
    }}>
      <span>ضيف التطبيق للشاشة الرئيسية 🔥</span>
      <button
        onClick={handleInstallClick}
        style={{
          marginLeft: '10px',
          background: 'white',
          color: '#ff5722',
          border: 'none',
          padding: '5px 10px',
          cursor: 'pointer',
          borderRadius: '5px'
        }}
      >
        أضف الآن
      </button>
    </div>
  )
}

export default InstallAppPrompt
