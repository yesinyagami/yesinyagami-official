// Global Type Definitions
export {}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    notify?: (message: string, type?: string) => void
    // Add other global functions as needed
  }
  
  // Animation libraries
  declare const animate: any
  declare const animateParticles: any
}