import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

export default [
  // 1. Decirle a ESLint qué archivos debe revisar
  { files: ["**/*.{js,mjs,cjs,vue}"] },
  
  // 2. Configuramos el entorno de Navegador (Browser)
  { languageOptions: { globals: globals.browser } },
  
  // 3. Reglas recomendadas de JavaScript base
  pluginJs.configs.recommended,
  
  // 4. Reglas recomendadas de Vue 3 (en formato Flat Config)
  ...pluginVue.configs["flat/recommended"],
  
  // 5. Tus reglas personalizadas (apagando el multi-word)
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "vue/multi-word-component-names": "off"
    }
  }
];