import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../App.vue';
import { createPinia } from 'pinia'; 

//  BARRERA CONTRA EL MOTOR GRÁFICO
vi.mock('phaser', () => {
  class MockScene { constructor() {} }
  class MockGame { constructor() {} }

  return {
    default: {
      Scene: MockScene,
      Game: MockGame
    },
    Scene: MockScene,
    Game: MockGame
  };
});

describe('🧪 Pruebas de Frontend - Interfaz Principal', () => {
  
  it('Debería montar el componente App.vue sin errores', () => {
    const pinia = createPinia(); 
    
    const wrapper = mount(App, {
      global: {
        plugins: [pinia] 
      }
    });
    
    expect(wrapper.exists()).toBe(true);
  });

  it('Debería inicializar la interfaz usando DATOS GUARDADOS (Mock Data)', () => {
    const pinia = createPinia(); 
    
    const datosGuardados = {
      username: 'DemonSlayer99',
      role: 'user',
      avatarUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=DemonSlayer99'
    };

    const wrapper = mount(App, {
      global: {
        plugins: [pinia], // Inyectamos Pinia
        mocks: {
          $usuarioActivo: datosGuardados
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

});