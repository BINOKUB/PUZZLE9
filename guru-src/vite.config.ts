// On utilise les modules de Node.js pour une gestion des chemins plus moderne
import { fileURLToPath, URL } from 'node:url'; 
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // ✅ La ligne 'base' est maintenant À L'INTÉRIEUR de l'objet retourné
    base: '/binokubguru/',

    define: {
      // Pas besoin d'avoir les deux, une seule suffit
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        // C'est la façon la plus moderne et fiable de définir un alias dans Vite
        '@': fileURLToPath(new URL('.', import.meta.url)),
      }
    }
  };
});