import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chibiverse.gacha',
  appName: 'Chibiverse Gacha Studio',
  webDir: 'dist',
  android: {
    backgroundColor: '#FFF6F9',
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SystemBars: {
      // Android 16 obliga a dibujar de borde a borde: Capacitor inyecta las
      // variables CSS --safe-area-inset-* para que la interfaz no quede debajo
      // de la barra de estado ni de la barra de navegación.
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
      style: 'LIGHT',
    },
  },
};

export default config;
