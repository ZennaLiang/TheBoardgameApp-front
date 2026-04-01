/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CHAT_URL: string;
  readonly VITE_CHAT_REFRESH: string;
  readonly VITE_BOARDGAME_ATLAS_API_URL: string;
  readonly VITE_BOARDGAME_ATLAS_CLIENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_FACEBOOK_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
