/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MONICA_API_KEY: string
  readonly MONICA_BASE_URL: string
  readonly MONICA_ONLY_MODE: string
  readonly DEVELOPMENT_MODE: string
  readonly MOCK_AI_RESPONSES: string
  readonly BUYMEACOFFEE_PROFILE_URL: string
  readonly IPASS_MERCHANT_ID: string
  readonly NODE_ENV: string
  readonly DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    notify: (notification: any) => string
  }
}