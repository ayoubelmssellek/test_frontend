import React, { useState, useEffect } from 'react';

const AddToHomeMessage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('addToHomeDismissed');
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('addToHomeDismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div style={{
      backgroundColor: '#fff3cd',
      color: '#856404',
      borderBottom: '1px solid #ffeeba',
      padding: '10px 20px',
      textAlign: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '15px'
    }}>
      <span>📱 زيد تطبيق Gusto Dakhla للشاشة الرئيسية ديالك</span>
      <button onClick={handleClose} style={{
        backgroundColor: '#ff5722',
        color: '#fff',
        border: 'none',
        padding: '6px 14px',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        ضيف
      </button>
    </div>
  );
};

export default AddToHomeMessage;
