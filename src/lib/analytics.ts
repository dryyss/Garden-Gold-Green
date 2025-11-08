// Google Analytics 4 Configuration
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

// Initialiser Google Analytics
export function initGA(measurementId: string) {
  if (typeof window === 'undefined') return

  // Script pour Google Analytics
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script1)

  // Initialisation gtag
  const script2 = document.createElement('script')
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      page_path: window.location.pathname,
    });
  `
  document.head.appendChild(script2)
}

// Track un événement
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', eventName, eventParams)
}

// Track une conversion (achat)
export function trackConversion(orderData: {
  transactionId: string
  value: number
  currency: string
  items: Array<{
    itemId: string
    itemName: string
    price: number
    quantity: number
    itemCategory?: string
  }>
}) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'purchase', {
    transaction_id: orderData.transactionId,
    value: orderData.value,
    currency: orderData.currency,
    items: orderData.items,
  })
}

// Track un view de produit
export function trackProductView(productData: {
  itemId: string
  itemName: string
  price: number
  itemCategory?: string
}) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'view_item', {
    currency: 'EUR',
    value: productData.price,
    items: [{
      item_id: productData.itemId,
      item_name: productData.itemName,
      price: productData.price,
      item_category: productData.itemCategory,
    }],
  })
}

// Track ajout au panier
export function trackAddToCart(productData: {
  itemId: string
  itemName: string
  price: number
  quantity: number
  itemCategory?: string
}) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'add_to_cart', {
    currency: 'EUR',
    value: productData.price * productData.quantity,
    items: [{
      item_id: productData.itemId,
      item_name: productData.itemName,
      price: productData.price,
      quantity: productData.quantity,
      item_category: productData.itemCategory,
    }],
  })
}

// Track page view
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Track recherche
export function trackSearch(searchTerm: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'search', {
    search_term: searchTerm,
  })
}

// Track début checkout
export function trackBeginCheckout(value: number) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'begin_checkout', {
    currency: 'EUR',
    value,
  })
}

// Track inscription newsletter
export function trackNewsletterSignup() {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'sign_up', {
    method: 'email',
  })
}

// Track contact
export function trackContact(formName: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'generate_lead', {
    content_name: formName,
  })
}







