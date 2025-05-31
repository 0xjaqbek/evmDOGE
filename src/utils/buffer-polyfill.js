// src/utils/buffer-polyfill.js
// This file handles the Buffer polyfill for browser environments

// Import the buffer package
import { Buffer as BufferPolyfill } from 'buffer';

// Add Buffer to the global scope if it doesn't exist
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = BufferPolyfill;
}

// Export Buffer for direct imports
export const Buffer = BufferPolyfill;

/*
Instructions to use this polyfill:

1. Install the 'buffer' package:
   npm install buffer

2. Import this polyfill at the entry point of your application (main.jsx):
   import './utils/buffer-polyfill';

3. If you need Buffer in a specific file, you can either:
   a. Use the global window.Buffer
   b. Import it directly from this file:
      import { Buffer } from '../utils/buffer-polyfill';
*/