import type { BikeConfiguration } from '../types/bike';
import { bikeCategories } from '../data/bikeData';
import { bikeRulesService } from './bikeRulesService';

/**
 * Service para manejar el cálculo de precios del configurador de bicicletas
 * COMPLETAMENTE DINÁMICO - funciona con cualquier categoría
 */
export const bikePricingService = {
  /**
   * Obtiene el precio dinámico de un componente específico
   * DINÁMICO: funciona con cualquier categoría
   */
  getDynamicPrice(
    categoryId: string, 
    value: string, 
    config: Partial<BikeConfiguration>
  ): number {
    // Precio base del componente
    const categoryData = bikeCategories.find(cat => cat.id === categoryId);
    const option = categoryData?.options.find(opt => opt.value === value);
    let finalPrice = option?.price || 0;
    
    // Crear configuración temporal con la selección actual
    const tempConfig = {
      ...config,
      components: {
        ...config.components,
        [categoryId]: value
      }
    };
    
    // Aplicar reglas de precios (ordenadas por prioridad)
    const applicableRules = bikeRulesService
      .getApplicableRules(tempConfig, 'pricing')
      .sort((a, b) => b.priority - a.priority); // Mayor prioridad primero
    
    for (const rule of applicableRules) {
      const priceModification = rule.effects.priceModifications?.find(
        mod => mod.category === categoryId && mod.value === value
      );
      
      if (priceModification) {
        if (priceModification.type === 'add') {
          finalPrice += priceModification.modifier;
        } else if (priceModification.type === 'multiply') {
          finalPrice *= priceModification.modifier;
        }
      }
    }
    
    return finalPrice;
  },

  /**
   * Calcula el precio total de una configuración completa
   * DINÁMICO: funciona con cualquier número de categorías
   */
  calculateTotalPrice(config: Partial<BikeConfiguration>): number {
    let totalPrice = 0;

    // Iterar sobre todas las categorías disponibles
    bikeCategories.forEach((category) => {
      const selectedValue = config.components?.[category.id];
      if (selectedValue) {
        const dynamicPrice = this.getDynamicPrice(category.id, selectedValue, config);
        totalPrice += dynamicPrice;
      }
    });

    return totalPrice;
  },

  /**
   * Obtiene el precio base de un componente (sin modificaciones)
   * DINÁMICO: funciona con cualquier categoría
   */
  getBasePrice(categoryId: string, value: string): number {
    const categoryData = bikeCategories.find(cat => cat.id === categoryId);
    const option = categoryData?.options.find(opt => opt.value === value);
    return option?.price || 0;
  },

  /**
   * Verifica si el precio de un componente ha sido modificado por reglas
   * DINÁMICO: funciona con cualquier categoría
   */
  isPriceModified(
    categoryId: string, 
    value: string, 
    config: Partial<BikeConfiguration>
  ): boolean {
    const basePrice = this.getBasePrice(categoryId, value);
    const dynamicPrice = this.getDynamicPrice(categoryId, value, config);
    return basePrice !== dynamicPrice;
  },

  /**
   * Obtiene el valor de configuración para una categoría específica
   * DINÁMICO: funciona con cualquier categoría
   */
  getConfigValue(config: Partial<BikeConfiguration>, categoryId: string): string | null {
    return config.components?.[categoryId] || null;
  }
}; 