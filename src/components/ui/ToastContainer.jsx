import React from 'react'

const icons = { success: '✅', warning: '⚠️', error: '❌' }

export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{icons[t.type] || '🔔'}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}
