const isProd = import.meta.env.PROD;

export const logger = {
  error: (context: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${context}:`, ...args);
  },
  warn: (context: string, ...args: unknown[]) => {
    if (!isProd) console.warn(`[WARN] ${context}:`, ...args);
  },
  info: (context: string, ...args: unknown[]) => {
    if (!isProd) console.info(`[INFO] ${context}:`, ...args);
  },
  debug: (context: string, ...args: unknown[]) => {
    if (!isProd) console.log(`[DEBUG] ${context}:`, ...args);
  },
};
