import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BikeConfiguration } from '../types/bike';
import { bikeCategories } from '../data/bikeData';
import { bikePricingService } from '../services/bikePricingService';
import { bikeRulesService } from '../services/bikeRulesService';
import { bikeConfigService } from '../services/bikeConfigService';

interface BikeStore {
  // Estado
  currentConfig: Partial<BikeConfiguration>;
  savedConfigurations: BikeConfiguration[];
  
  // Acciones
  updateComponent: (categoryId: string, value: string | null) => void;
  calculatePrice: () => number;
  saveConfiguration: () => string;
  loadConfiguration: (id: string) => boolean;
  resetConfiguration: () => void;
  getAvailableOptions: (categoryId: string) => string[];
  isOptionDisabled: (categoryId: string, value: string) => boolean;
  getDynamicPrice: (categoryId: string, value: string) => number;
}

export const useBikeStore = create<BikeStore>()(
  persist(
    (set, get) => ({
      currentConfig: { components: {} },
      savedConfigurations: [],

      updateComponent: (categoryId, value) => {
        set((state) => ({
          currentConfig: {
            ...state.currentConfig,
            components: {
              ...state.currentConfig.components,
              [categoryId]: value
            }
          }
        }));
      },

      calculatePrice: () => {
        const config = get().currentConfig;
        return bikePricingService.calculateTotalPrice(config);
      },

      getDynamicPrice: (categoryId, value) => {
        const config = get().currentConfig;
        return bikePricingService.getDynamicPrice(categoryId, value, config);
      },

      saveConfiguration: () => {
        const config = get().currentConfig;
        const newConfiguration = bikeConfigService.createConfiguration(config);

        set((state) => ({
          savedConfigurations: [...state.savedConfigurations, newConfiguration],
        }));

        return newConfiguration.id;
      },

      loadConfiguration: (id) => {
        const savedConfig = get().savedConfigurations.find(config => config.id === id);
        if (savedConfig) {
          set({
            currentConfig: {
              components: savedConfig.components,
              id: savedConfig.id,
              totalPrice: savedConfig.totalPrice,
              createdAt: savedConfig.createdAt,
              updatedAt: savedConfig.updatedAt,
            },
          });
          return true;
        }
        return false;
      },

      resetConfiguration: () => {
        set({ currentConfig: { components: {} } });
      },

      getAvailableOptions: (categoryId) => {
        const categoryConfig = bikeCategories.find(cat => cat.id === categoryId);
        if (!categoryConfig) return [];
        
        return categoryConfig.options
          .filter(option => !get().isOptionDisabled(categoryId, option.value))
          .map(option => option.value);
      },

      isOptionDisabled: (categoryId, value) => {
        const config = get().currentConfig;
        return bikeRulesService.isOptionDisabled(categoryId, value, config);
      },
    }),
    {
      name: 'bike-configurator-storage',
      partialize: (state) => ({ savedConfigurations: state.savedConfigurations }),
    }
  )
); 