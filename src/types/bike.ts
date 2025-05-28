// ===== SISTEMA DINÁMICO Y ESCALABLE =====

/**
 * Configuración dinámica de una bicicleta
 * Permite cualquier número de categorías sin modificar código
 */
export interface BikeConfiguration {
  id: string;
  // Configuración dinámica: cualquier categoría puede tener cualquier valor
  components: Record<string, string | null>; // { 'frame-type': 'full-suspension', 'bag': 'large', ... }
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Opción de un componente
 */
export interface ComponentOption {
  value: string;
  label: string;
  price: number;
  description?: string;
}

/**
 * Configuración de una categoría de componentes
 * Completamente dinámica - se puede agregar cualquier categoría
 */
export interface CategoryConfig {
  id: string; // 'frame-type', 'wheels', 'bag', 'lights', etc.
  name: string;
  description: string;
  options: ComponentOption[];
  required: boolean;
  order?: number; // Para ordenar las categorías en la UI
}

/**
 * Regla de negocio dinámica
 * Funciona con cualquier categoría sin modificar código
 */
export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  type: 'compatibility' | 'pricing';
  
  // Condiciones dinámicas: cualquier categoría puede tener condiciones
  conditions: Record<string, string[]>; // { 'frame-type': ['full-suspension'], 'bag': ['large'] }
  
  // Efectos de la regla
  effects: {
    // Para reglas de compatibilidad
    disableOptions?: {
      category: string; // Cualquier categoría
      values: string[];
    }[];
    
    // Para reglas de precios
    priceModifications?: {
      category: string; // Cualquier categoría
      value: string;
      modifier: number;
      type: 'add' | 'multiply';
    }[];
  };
  
  // Metadatos
  active: boolean;
  priority: number;
  createdAt?: Date;
  updatedAt?: Date;
}