declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: string;
      DATABASE_URL: string;
      WEB_CLIENT: string;
    }
  }
}

export {}
