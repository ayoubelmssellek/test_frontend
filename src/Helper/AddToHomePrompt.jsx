import { useEffect, useState } from 'react'

function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showAndroid, setShowAndroid] = useState(false)
  const [showIOS, setShowIOS] = useState(false)
  const [closed, setClosed] = useState(false)

  // Detect iOS
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/.test(userAgent)
  }

  // Detect if in Safari
  const isInStandaloneMode = () =>
    'standalone' in window.navigator && window.navigator.standalone

  useEffect(() => {
    // Android support
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowAndroid(true)
    })

    // iOS manual guide
    if (isIos() && !isInStandaloneMode()) {
      setShowIOS(true)
    }
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
        setShowAndroid(false)
      })
    }
  }

  const handleClose = () => {
    setClosed(true)
  }

  if ((!showAndroid && !showIOS) || closed) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      backgroundColor: '#ff5722',
      color: 'white',
      padding: '10px 40px 10px 10px',
      textAlign: 'center',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ flex: 1 }}>
        {showAndroid && (
          <>
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
          </>
        )}

        {showIOS && (
          <span>
            📱 باش تضيف التطبيق، ضغط على <strong>مشاركة</strong> ثم <strong>إضافة إلى الشاشة الرئيسية</strong>.
          </span>
        )}
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          position: 'absolute',
          top: '5px',
          right: '10px'
        }}
      >
        ❌
      </button>
    </div>
  )
}

export default InstallAppPrompt
