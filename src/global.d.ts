// Global type declarations

declare global {
  interface Window {
    notify?: (message: string, type?: string) => void
  }

  // Web Animations API
  declare function animate(
    keyframes: PropertyIndexedKeyframes | Keyframe[] | null,
    options?: number | KeyframeAnimationOptions
  ): Animation
}

export {}