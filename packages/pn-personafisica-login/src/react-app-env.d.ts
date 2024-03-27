/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'uat' | 'production';
  }
}
interface Window {
  Stripe: any;
}
