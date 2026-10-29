import { defineConfig, PluginOption } from "vite";
import { enterDevPlugin, enterProdPlugin } from 'vite-plugin-enter-dev';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    // O index.html já declara só as duas fontes usadas; sem isso o build injeta
    // ~20 famílias do Google, que travam a primeira pintura no celular.
    ...enterProdPlugin({ injectGoogleFonts: false }),
  ];
  if (mode === 'development') {
    plugins.push(...enterDevPlugin());
  }
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: plugins.filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: '/',
    build: {
      outDir: 'dist',
      manifest: true,
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // Bibliotecas que quase nunca mudam ficam em arquivos próprios:
          // o visitante que volta só baixa o que realmente mudou.
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-supabase': ['@supabase/supabase-js'],
          },
        },
      },
    }
  };
});