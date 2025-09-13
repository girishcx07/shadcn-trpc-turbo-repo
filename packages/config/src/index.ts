// Re-export everything from config package
export * from './env'; 
export * from './constants';
export * from './zod-schemas';
     
// Create a unified config object for easy access
import { getEnv } from './env';
import * as constants from './constants';
import { schemas } from './zod-schemas';

export const config = {
  env: getEnv,
  constants,
  schemas,
} as const;