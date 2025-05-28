import type { BikeConfiguration } from '../types/bike';
import { bikeCategories } from '../data/bikeData';
import { bikePricingService } from './bikePricingService';

/**
 * Service para manejar la gestión de configuraciones de bicicletas
 * COMPLETAMENTE DINÁMICO - funciona con cualquier categoría
 */
export const bikeConfigService = {
  /**
   * Genera un ID único para una configuración
   */
  generateConfigId(): string {
    return 'MK' + Math.random().toString(36).substr(2, 5).toUpperCase();
  },

  /**
   * Valida si una configuración está completa
   * DINÁMICO: funciona con cualquier número de categorías
   * Solo valida categorías marcadas como required: true
   */
  isConfigurationComplete(config: Partial<BikeConfiguration>): boolean {
    return bikeCategories
      .filter(category => category.required) // Solo categorías requeridas
      .every(category => {
        const value = config.components?.[category.id];
        return value !== null && value !== undefined;
      });
  },

  /**
   * Obtiene las categorías faltantes en una configuración
   * DINÁMICO: funciona con cualquier número de categorías
   * Solo considera categorías marcadas como required: true
   */
  getMissingCategories(config: Partial<BikeConfiguration>): string[] {
    return bikeCategories
      .filter(category => category.required) // Solo categorías requeridas
      .filter(category => {
        const value = config.components?.[category.id];
        return !value;
      })
      .map(category => category.id);
  },

  /**
   * Crea una configuración completa con metadatos
   * DINÁMICO: funciona con cualquier estructura
   */
  createConfiguration(
    config: Partial<BikeConfiguration>,
    id?: string
  ): BikeConfiguration {
    const now = new Date();
    const configId = id || this.generateConfigId();
    
    // Asegurar que tenemos la estructura components
    const components = config.components || {};
    
    return {
      id: configId,
      components,
      totalPrice: bikePricingService.calculateTotalPrice(config),
      createdAt: now,
      updatedAt: now,
    };
  },

  /**
   * Valida una configuración y retorna errores si los hay
   */
  validateConfiguration(config: Partial<BikeConfiguration>): string[] {
    const errors: string[] = [];
    
    if (!this.isConfigurationComplete(config)) {
      const missingCategories = this.getMissingCategories(config);
      errors.push(`Missing selections: ${missingCategories.join(', ')}`);
    }
    
    // Aquí se pueden agregar más validaciones específicas
    
    return errors;
  },

  /**
   * Obtiene un resumen legible de una configuración
   * DINÁMICO: funciona con cualquier número de categorías
   */
  getConfigurationSummary(config: Partial<BikeConfiguration>): string {
    const parts: string[] = [];
    
    bikeCategories.forEach(category => {
      const value = config.components?.[category.id];
      if (value) {
        const option = category.options.find(opt => opt.value === value);
        if (option) {
          const price = bikePricingService.getDynamicPrice(category.id, value, config);
          parts.push(`${category.name}: ${option.label} (${price} EUR)`);
        }
      }
    });
    
    const total = bikePricingService.calculateTotalPrice(config);
    parts.push(`Total: ${total} EUR`);
    
    return parts.join('\n');
  }
}; 