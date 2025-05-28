# 🚀 Sistema de Reglas Unificado - Demo

## 🎯 **Problema Solucionado**

### ❌ **Antes: Sistema Fragmentado**
```typescript
// Reglas de compatibilidad separadas
compatibilityRules: CompatibilityRule[]

// Reglas de precios separadas  
pricingRules: PricingRule[]

// ❌ Problemas:
// - Dos sistemas diferentes
// - Difícil de mantener
// - No escalable para Supabase
// - Precios no se aplicaban correctamente
```

### ✅ **Ahora: Sistema Unificado**
```typescript
// UNA SOLA estructura para todo
businessRules: BusinessRule[]

// ✅ Beneficios:
// - Sistema unificado
// - Fácil de mantener
// - Perfecto para Supabase
// - Precios dinámicos funcionando
```

## 🏗️ **Arquitectura del Nuevo Sistema**

### **Estructura de Regla Unificada**
```typescript
interface BusinessRule {
  id: string;
  name: string;
  description: string;
  type: 'compatibility' | 'pricing';
  
  // Condiciones (cuándo aplicar)
  conditions: {
    frameType?: FrameType[];
    frameFinish?: FrameFinish[];
    wheels?: WheelType[];
    rimColor?: RimColor[];
    chain?: ChainType[];
  };
  
  // Efectos (qué hacer)
  effects: {
    // Para compatibilidad
    disableOptions?: {
      category: ComponentCategory;
      values: string[];
    }[];
    
    // Para precios
    priceModifications?: {
      category: ComponentCategory;
      value: string;
      newPrice: number;
    }[];
  };
  
  // Metadatos para Supabase
  active: boolean;
  priority: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## 📊 **Ejemplos de Reglas Implementadas**

### **1. Regla de Compatibilidad**
```typescript
{
  id: 'mountain-wheels-compatibility',
  name: 'Mountain Wheels Compatibility',
  description: 'Mountain wheels are only available for full-suspension frames',
  type: 'compatibility',
  conditions: {
    wheels: ['mountain']  // Cuando se seleccionan ruedas de montaña
  },
  effects: {
    disableOptions: [
      {
        category: 'frame-type',
        values: ['diamond', 'step-through']  // Deshabilitar estos marcos
      }
    ]
  },
  active: true,
  priority: 1
}
```

### **2. Regla de Precios Dinámicos (MEJORADO)**
```typescript
{
  id: 'matte-finish-full-suspension-pricing',
  name: 'Matte Finish Full-Suspension Pricing',
  description: 'Matte finish costs +20 EUR extra for full-suspension frames',
  type: 'pricing',
  conditions: {
    frameType: ['full-suspension'],  // Para marcos full-suspension
    frameFinish: ['matte']           // Con acabado mate
  },
  effects: {
    priceModifications: [
      {
        category: 'frame-finish',
        value: 'matte',
        modifier: 20,    // +20 EUR al precio base
        type: 'add'      // Suma al precio base
      }
    ]
  },
  active: true,
  priority: 2
}
```

### **Flexibilidad del Sistema de Modificadores**
```typescript
// Ejemplos de modificadores posibles:
modifier: 20,     type: 'add'      // +20 EUR
modifier: -10,    type: 'add'      // -10 EUR (descuento)
modifier: 1.5,    type: 'multiply' // x1.5 (50% más caro)
modifier: 0.8,    type: 'multiply' // x0.8 (20% descuento)
```

## 🎯 **Casos de Uso Demostrados**

### **Caso 1: Obama's Bike (303 EUR)**
```
Frame: Full-suspension (130 EUR)
Finish: Shiny (30 EUR)  ← Precio base (sin modificadores)
Wheels: Road wheels (80 EUR)
Rim: Blue (20 EUR)
Chain: Single-speed (43 EUR)
Total: 303 EUR ✅
```

### **Caso 2: Precios con Modificadores**
```
Frame: Full-suspension (130 EUR)
Finish: Matte (30 + 20 = 50 EUR)  ← Precio base + modificador
Wheels: Road wheels (80 EUR)
Rim: Black (20 EUR)
Chain: 8-speed (85 EUR)
Total: 365 EUR ✅
```

### **Caso 3: Múltiples Modificadores (Futuro)**
```
Frame: Diamond (100 EUR)
Finish: Matte (30 + 20 - 5 = 45 EUR)  ← Base + regla1 + regla2
Wheels: Road wheels (80 EUR)
Rim: Blue (20 EUR)
Chain: Single-speed (43 EUR)
Total: 288 EUR ✅
```

## 🗄️ **Migración a Supabase (ACTUALIZADA)**

### **Tabla: business_rules**
```sql
CREATE TABLE business_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) CHECK (type IN ('compatibility', 'pricing')),
  conditions JSONB NOT NULL,
  effects JSONB NOT NULL,
  active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Ejemplo de Datos en Supabase**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Matte Finish Full-Suspension Pricing",
  "description": "Matte finish costs +20 EUR extra for full-suspension frames",
  "type": "pricing",
  "conditions": {
    "frameType": ["full-suspension"],
    "frameFinish": ["matte"]
  },
  "effects": {
    "priceModifications": [
      {
        "category": "frame-finish",
        "value": "matte",
        "modifier": 20,
        "type": "add"
      }
    ]
  },
  "active": true,
  "priority": 2
}
```

### **Ejemplos de Reglas Flexibles**
```json
// Descuento por volumen
{
  "name": "Volume Discount",
  "effects": {
    "priceModifications": [
      {
        "category": "frame-type",
        "value": "full-suspension",
        "modifier": -50,
        "type": "add"
      }
    ]
  }
}

// Recargo por premium
{
  "name": "Premium Surcharge",
  "effects": {
    "priceModifications": [
      {
        "category": "wheels",
        "value": "fat-bike",
        "modifier": 1.2,
        "type": "multiply"
      }
    ]
  }
}
```

## 🔧 **Funciones del Sistema (ACTUALIZADAS)**

### **1. Evaluación de Reglas**
```typescript
function evaluateRule(rule: BusinessRule, config: Partial<BikeConfiguration>): boolean {
  // Verifica si todas las condiciones se cumplen
  // Retorna true si la regla debe aplicarse
}
```

### **2. Precios Dinámicos con Modificadores**
```typescript
function getDynamicPrice(category: ComponentCategory, value: string, config: Partial<BikeConfiguration>): number {
  // 1. Obtiene precio base
  let finalPrice = basePrice;
  
  // 2. Busca reglas de pricing aplicables
  const applicableRules = businessRules.filter(rule => 
    rule.type === 'pricing' && 
    rule.active && 
    evaluateRule(rule, config)
  );
  
  // 3. Aplica TODOS los modificadores aplicables
  for (const rule of applicableRules) {
    const modification = rule.effects.priceModifications?.find(
      mod => mod.category === category && mod.value === value
    );
    
    if (modification) {
      if (modification.type === 'add') {
        finalPrice += modification.modifier;  // +20, -10, etc.
      } else if (modification.type === 'multiply') {
        finalPrice *= modification.modifier;  // x1.5, x0.8, etc.
      }
    }
  }
  
  // 4. Retorna precio final
  return finalPrice;
}
```

### **3. Compatibilidad**
```typescript
function isOptionDisabled(category: ComponentCategory, value: string, config: Partial<BikeConfiguration>): boolean {
  // 1. Crea configuración temporal
  // 2. Evalúa reglas de compatibilidad
  // 3. Retorna si la opción debe deshabilitarse
}
```

## 🎨 **UI Mejorada**

### **Precios Dinámicos Visibles**
- ✅ **Precio actual**: Resaltado en azul cuando cambia
- ✅ **Precio original**: Tachado cuando hay modificación
- ✅ **Feedback visual**: El usuario ve inmediatamente los cambios

### **Compatibilidad Clara**
- ✅ **Opciones deshabilitadas**: Grises con "Not compatible"
- ✅ **Validación en tiempo real**: Inmediata al seleccionar

## 🚀 **Beneficios del Sistema de Modificadores**

### **Para Desarrollo**
- ✅ **Más robusto**: Modificadores en lugar de precios fijos
- ✅ **Composable**: Múltiples reglas pueden aplicarse
- ✅ **Flexible**: +/- para ajustes, x para porcentajes

### **Para Negocio**
- ✅ **Descuentos fáciles**: modifier: -10 para 10 EUR menos
- ✅ **Recargos simples**: modifier: 20 para 20 EUR más
- ✅ **Porcentajes**: modifier: 1.2 para 20% más caro
- ✅ **Combinaciones**: Múltiples reglas se suman/multiplican

### **Para Supabase**
- ✅ **Queries simples**: WHERE modifier > 0 (recargos)
- ✅ **Reportes fáciles**: SUM(modifier) por categoría
- ✅ **Admin intuitivo**: Campos +/- en lugar de precios absolutos

---

**Estado**: ✅ **SISTEMA UNIFICADO FUNCIONANDO**  
**Precios dinámicos**: ✅ **APLICÁNDOSE CORRECTAMENTE**  
**Preparado para Supabase**: ✅ **100% LISTO** 