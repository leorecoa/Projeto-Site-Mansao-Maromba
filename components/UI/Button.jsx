import React from 'react'

const Button = ({ children, primary, secondary, ...props }) => {
  const bgColor = primary ? 'var(--color-primary)' : (secondary ? 'var(--color-secondary)' : '#333')
  const textColor = primary ? '#000' : '#fff'

  return (
    <button 
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '16px',
        fontWeight: 'bold',
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button