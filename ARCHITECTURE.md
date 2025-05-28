# Arquitectura del Bike Configurator

## Separación de Responsabilidades

### 📁 `/src/data/`
**Solo datos estáticos**
- `bikeData.ts`: Categorías de componentes y reglas de negocio
- Sin lógica de negocio, solo estructuras de datos

### 🔧 `/src/services/`
**Lógica de negocio pura**

#### `bikeRulesService.ts`
- Evaluación de reglas de compatibilidad y pricing
- Verificación de opciones deshabilitadas
- Mapeo de categorías a claves de configuración

```typescript
bikeRulesService.evaluateRule(rule, config)
bikeRulesService.isOptionDisabled(category, value, config)
bikeRulesService.getApplicableRules(config, type)
```

#### `bikePricingService.ts`
- Cálculo de precios dinámicos
- Aplicación de modificadores de precio
- Comparación entre precios base y dinámicos

```typescript
bikePricingService.getDynamicPrice(category, value, config)
bikePricingService.calculateTotalPrice(config)
bikePricingService.isPriceModified(category, value, config)
```

#### `bikeConfigService.ts`
- Gestión de configuraciones
- Validación de completitud
- Generación de IDs y resúmenes

```typescript
bikeConfigService.isConfigurationComplete(config)
bikeConfigService.createConfiguration(config)
bikeConfigService.getConfigurationSummary(config)
```

### 🏪 `/src/store/`
**Estado global y coordinación**
- `bikeStore.ts`: Zustand store que orquesta los services
- No contiene lógica de negocio, solo coordinación

### 🎨 `/src/components/`
**Interfaz de usuario**
- Solo lógica de presentación
- Consume el store y services cuando es necesario

## Ventajas de esta Arquitectura

### ✅ **Separación Clara**
- **Datos**: Solo estructuras estáticas
- **Services**: Lógica de negocio pura, testeable
- **Store**: Coordinación de estado
- **Components**: Solo UI

### ✅ **Testabilidad**
```typescript
// Fácil de testear
expect(bikePricingService.getDynamicPrice('frame-finish', 'matte', {
  frameType: 'full-suspension'
})).toBe(50);
```

### ✅ **Reutilización**
```typescript
// Los services se pueden usar en cualquier parte
import { bikeConfigService } from '../services';

const summary = bikeConfigService.getConfigurationSummary(config);
```

### ✅ **Mantenibilidad**
- Cambios en lógica de pricing → solo `bikePricingService`
- Nuevas reglas → solo `bikeRulesService`
- Cambios en validación → solo `bikeConfigService`

### ✅ **Preparado para Supabase**
```typescript
// Fácil migración a API
export const bikeRulesService = {
  async getActiveRules() {
    return await supabase.from('business_rules').select('*');
  }
};
```

## Comparación: Antes vs Después

### ❌ **Antes (bikeData.ts)**
```typescript
// Mezclaba datos con lógica
export const bikeCategories = [...];
export const businessRules = [...];
export function evaluateRule() { /* lógica */ }
export function getDynamicPrice() { /* lógica */ }
export function isOptionDisabled() { /* lógica */ }
```

### ✅ **Después**
```typescript
// bikeData.ts - Solo datos
export const bikeCategories = [...];
export const businessRules = [...];

// bikeRulesService.ts - Solo lógica de reglas
export const bikeRulesService = {
  evaluateRule() { /* lógica */ },
  isOptionDisabled() { /* lógica */ }
};

// bikePricingService.ts - Solo lógica de precios
export const bikePricingService = {
  getDynamicPrice() { /* lógica */ },
  calculateTotalPrice() { /* lógica */ }
};
```

## Principios Aplicados

1. **Single Responsibility Principle**: Cada service tiene una responsabilidad específica
2. **Separation of Concerns**: Datos, lógica y UI están separados
3. **Dependency Injection**: Services se pueden intercambiar fácilmente
4. **Pure Functions**: Services son funciones puras, fáciles de testear

Esta arquitectura hace el código más mantenible, testeable y preparado para escalar. 