import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    // NUEVO: Recuperamos el usuario (y su avatar) si ya existe en localStorage
    user: JSON.parse(localStorage.getItem('user')) || null, 
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
        
        // Guardar el token
        this.token = data.token || 'auth-cookie-mode';
        localStorage.setItem('token', this.token);

        // NUEVO: Guardar los datos del usuario para acceder a su Avatar consumido de la API externa
        if (data.user) {
          this.user = data.user;
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
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
      this.user = null; // Limpiar usuario
      localStorage.removeItem('token');
      localStorage.removeItem('user');  // Limpiar localStorage
    }
  }
});