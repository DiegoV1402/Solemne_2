import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  // 1. Configuramos el entorno de Node.js
  { languageOptions: { globals: globals.node } },
  
  // 2. Activamos las reglas recomendadas estándar
  pluginJs.configs.recommended,
  
  // 3. Añadimos tus reglas personalizadas
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];