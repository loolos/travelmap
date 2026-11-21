/// <reference types="vite/client" />
declare module 'virtual:core-manifest' {
  const entries: { path: string; bytes: number; rev: string }[];
  export default entries;
}
declare const __APP_VERSION__: string;
