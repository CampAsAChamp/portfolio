/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="vite/client" />

// Global type augmentations
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
  }
}

interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    ready: Promise<void>
    updateCallbackDone: Promise<void>
    finished: Promise<void>
    skipTransition: () => void
  }
}
