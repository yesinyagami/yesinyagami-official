/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ADMIN_ALLOWED_IPS: string
  readonly VITE_SUPER_ADMIN_EMAIL: string
  readonly VITE_SUPER_ADMIN_PASSWORD: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}