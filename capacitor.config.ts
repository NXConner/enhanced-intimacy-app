import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.com.example',
  appName: 'app',
  webDir: 'out',
  server: {
    url: 'http://10.0.2.2:3000',
    cleartext: true
  }
};

export default config;
