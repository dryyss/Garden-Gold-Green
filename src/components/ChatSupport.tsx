'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    $crisp?: any
    CRISP_WEBSITE_ID?: string
  }
}

export function ChatSupport() {
  useEffect(() => {
    // Initialiser Crisp (solution de chat en temps réel gratuite)
    // Vous pouvez remplacer par Intercom, Zendesk, etc.
    
    // Configuration Crisp
    const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID

    if (!crispWebsiteId) {
      // Silencieux si Crisp n'est pas configuré (optionnel)
      return
    }

    // Initialiser Crisp
    window.$crisp = []
    window.CRISP_WEBSITE_ID = crispWebsiteId

    // Charger le script Crisp
    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.head.appendChild(script)

    // Configuration Crisp
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:hide'])
      window.$crisp.push(['set', 'user:nickname', ['Customer']])
      
      // Options de configuration
      window.$crisp.push(['set', 'session:segments', [['visitor']]])
    }

    // Alternative: Si vous voulez utiliser un autre service
    // Intercom:
    // window.Intercom('boot', {
    //   app_id: 'your-intercom-app-id'
    // })

    return () => {
      // Nettoyage si nécessaire
    }
  }, [])

  // Fonction pour ouvrir le chat manuellement
  const openChat = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:open'])
    }
  }

  return null
}

// Composant bouton pour ouvrir le chat (optionnel)
export function ChatButton() {
  const openChat = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:open'])
    }
  }

  return (
    <button
      onClick={openChat}
      className="fixed bottom-6 right-6 bg-brand-gold text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
      aria-label="Ouvrir le chat support"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
}

