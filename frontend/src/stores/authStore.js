import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Recuperar el token del almacenamiento local si existe
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error en las credenciales');
        
        // Guardar el token en el estado y en el navegador
        this.token = data.token;
        localStorage.setItem('token', data.token);
        
        return true;
      } catch (error) {
        console.error('Error en el login:', error);
        throw error;
      }
    },

   async register(username, email, password) {
      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Ahora enviamos el email también al backend
          body: JSON.stringify({ username, email, password }) 
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al registrarse');
        
        return true;
      } catch (error) {
        console.error('Error en el registro:', error);
        throw error;
      }
    },

    logout() {
      this.token = null;
      localStorage.removeItem('token');
    }
  }
});