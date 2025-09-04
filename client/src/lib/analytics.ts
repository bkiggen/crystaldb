// src/lib/analytics.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Your GA4 Measurement ID (get this from GA4 dashboard)
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"

// Initialize Google Analytics
export const initGA = () => {
  // Don't track in development
  if (import.meta.env.DEV) {
    return
  }

  // Load the GA script
  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }

  // Configure GA
  window.gtag("js", new Date())
  window.gtag("config", GA_MEASUREMENT_ID, {
    // Enhanced measurement will automatically track page views
    send_page_view: true,
    // Custom configuration
    custom_map: {
      custom_parameter_1: "theatre_name",
    },
  })
}

// Track external link clicks
export const trackExternalClick = (url: string, theatreName: string) => {
  if (typeof window.gtag === "undefined") return

  window.gtag("event", "external_link_click", {
    event_category: "engagement",
    event_label: theatreName,
    external_url: url,
    theatre_name: theatreName,
    // This creates a custom dimension you can analyze
    custom_parameter_1: theatreName,
  })
}

// Track custom events (optional - for additional insights)
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window.gtag === "undefined") return

  window.gtag("event", eventName, {
    event_category: "custom",
    ...parameters,
  })
}

// Track page views manually if needed
export const trackPageView = (url: string, title?: string) => {
  if (typeof window.gtag === "undefined") return

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_location: url,
    page_title: title,
  })
}
