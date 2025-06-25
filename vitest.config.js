// import { defineConfig } from 'vitest/config'

// export default defineConfig({
//   test: {
//     globals: true,
//     environment: 'miniflare',
//     environmentOptions: {
//       modules: true,
//       bindings: {
//         JWT_SECRET: 'test-secret',
//         JWT_USERS: 'test-user-1,test-user-2'
//       }
//       // Remove D1 database configuration as we'll mock it differently
//     }
//   }
// })

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000, // Increase timeout to 30 seconds
    hookTimeout: 30000, // Increase hook timeout too
    include: ['./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  }
})
