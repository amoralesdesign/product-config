/**
 * Services para el configurador de bicicletas
 * 
 * Arquitectura de services:
 * - bikeRulesService: Maneja las reglas de negocio (compatibilidad y pricing)
 * - bikePricingService: Maneja el cálculo de precios dinámicos
 * - bikeConfigService: Maneja la gestión de configuraciones (validación, creación, etc.)
 */

export { bikeRulesService } from './bikeRulesService';
export { bikePricingService } from './bikePricingService';
export { bikeConfigService } from './bikeConfigService'; 