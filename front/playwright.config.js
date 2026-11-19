
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  // Directorio donde están los tests
  testDir: './tests',

  // Tiempo máximo por prueba
  timeout: 30000,

  // URL base de la aplicación
  use: {
    baseURL: 'http://localhost:5173',
    ...devices['Desktop Chrome'],
    headless: true,
  },

  // Levanta Vite automáticamente
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },

});
