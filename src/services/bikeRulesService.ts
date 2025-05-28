import type { BusinessRule, BikeConfiguration } from '../types/bike';
import { businessRules } from '../data/bikeData';

/**
 * Service para manejar las reglas de negocio del configurador de bicicletas
 * COMPLETAMENTE DINÁMICO - funciona con cualquier categoría
 */
export const bikeRulesService = {
  /**
   * Evalúa si una regla se aplica a una configuración específica
   * DINÁMICO: funciona con cualquier número de categorías
   */
  evaluateRule(rule: BusinessRule, config: Partial<BikeConfiguration>): boolean {
    const { conditions } = rule;
    
    // Helper function para verificar una condición específica
    const checkCondition = (conditionValues: string[] | undefined, configValue: string | null | undefined): boolean => {
      if (!conditionValues) return true; // Sin condición = válido
      if (!configValue) return false;    // Con condición pero sin valor = inválido
      return conditionValues.includes(configValue); // Verificar si está en la lista
    };
    
    // Verificar TODAS las condiciones dinámicamente
    return Object.entries(conditions).every(([categoryId, allowedValues]) => {
      const configValue = config.components?.[categoryId];
      return checkCondition(allowedValues, configValue);
    });
  },

  /**
   * Obtiene todas las reglas activas de un tipo específico
   */
  getActiveRules(type?: 'compatibility' | 'pricing'): BusinessRule[] {
    return businessRules.filter(rule => 
      rule.active && (type ? rule.type === type : true)
    );
  },

  /**
   * Obtiene las reglas aplicables a una configuración específica
   */
  getApplicableRules(config: Partial<BikeConfiguration>, type?: 'compatibility' | 'pricing'): BusinessRule[] {
    return this.getActiveRules(type).filter(rule => 
      this.evaluateRule(rule, config)
    );
  },

  /**
   * Verifica si una opción específica está deshabilitada por las reglas de compatibilidad
   * DINÁMICO: funciona con cualquier categoría
   */
  isOptionDisabled(
    categoryId: string,
    value: string,
    config: Partial<BikeConfiguration>
  ): boolean {
    // Crear configuración temporal con la selección propuesta
    const tempConfig = {
      ...config,
      components: {
        ...config.components,
        [categoryId]: value
      }
    };
    
    // Verificar reglas de compatibilidad
    const compatibilityRules = this.getActiveRules('compatibility');
    
    for (const rule of compatibilityRules) {
      if (this.evaluateRule(rule, tempConfig)) {
        const disabledOption = rule.effects.disableOptions?.find(
          disable => disable.category === categoryId && disable.values.includes(value)
        );
        
        if (disabledOption) {
          return true;
        }
      }
    }
    
    return false;
  }
}; 