# 🚴‍♂️ Famous Markus' Bike Shop - Configurador MVP

Un configurador de bicicletas personalizadas desarrollado como MVP para Famous Markus' Bike Shop.

## 🎯 Objetivo del Proyecto

Desarrollar un MVP funcional en 8 horas que permita a los vendedores configurar bicicletas personalizadas con cálculo de precios dinámico y sistema de reglas de compatibilidad.

## 🏗️ Arquitectura y Decisiones Técnicas

### Stack Tecnológico Elegido
- **React 18 + TypeScript**: Para componentes tipados y reutilizables
- **Tailwind CSS**: Para UI rápida y moderna
- **Zustand**: State management ligero (más simple que Redux para MVP)
- **Vite**: Build tool rápido para desarrollo
- **Lucide React**: Iconos modernos y ligeros

### Decisiones de Priorización (8h)

#### ✅ **ALTA PRIORIDAD (6h)**
- ✅ Editor de configuración principal con 5 categorías
- ✅ Sistema de precios dinámico
- ✅ Reglas de compatibilidad flexibles
- ✅ UI moderna y responsive
- ✅ Persistencia con localStorage

#### ⚠️ **MEDIA PRIORIDAD (1.5h)**
- ✅ Guardar/cargar configuraciones
- ✅ Validación de reglas de negocio
- ✅ Feedback visual de incompatibilidades

#### ❌ **EXCLUIDAS por tiempo**
- ❌ Pantalla inicial de selección de modelo
- ❌ Preview visual de la bicicleta
- ❌ Base de datos real (Supabase)
- ❌ Autenticación de usuarios

## 🚀 Características Implementadas

### Core Features
- **Configurador de 5 componentes**: Marco, acabado, ruedas, color de llantas, cadena
- **Cálculo de precios dinámico**: Suma base + reglas especiales
- **Sistema de reglas flexible**: Incompatibilidades configurables
- **Persistencia local**: Guardar/cargar configuraciones
- **UI responsive**: Funciona en desktop y móvil

### Reglas de Negocio Implementadas
1. **Ruedas de montaña** solo disponibles para marcos **full-suspension**
2. **Ruedas fat bike** no disponibles en color **rojo**
3. **Precios especiales** según combinaciones (ej: mate + full-suspension)

### Funcionalidades UX
- Feedback visual de opciones incompatibles
- Cálculo de precio en tiempo real
- Historial de configuraciones guardadas
- IDs únicos para compartir configuraciones

## 🛠️ Instalación y Ejecución

```bash
# Clonar e instalar dependencias
cd bike-configurator
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── BikeConfigurator.tsx    # Componente principal
│   ├── ComponentSelector.tsx   # Selector de componentes
│   ├── PriceSummary.tsx       # Resumen de precios
│   └── LoadConfiguration.tsx   # Cargar configuraciones
├── store/               # Estado global (Zustand)
│   └── bikeStore.ts
├── types/               # Tipos TypeScript
│   └── bike.ts
├── data/                # Datos y reglas de negocio
│   └── bikeData.ts
└── App.tsx              # Punto de entrada
```

## 🧠 Patrones de Diseño Aplicados

### Clean Architecture
- **Separación de responsabilidades**: Componentes, lógica de negocio, tipos
- **Componentes tontos**: UI pura sin lógica de negocio
- **Store centralizado**: Estado global manejado por Zustand
- **Tipos estrictos**: TypeScript para prevenir errores

### Componentes Atómicos
- `ComponentSelector`: Reutilizable para cualquier categoría
- `PriceSummary`: Componente puro que recibe datos del store
- `LoadConfiguration`: Funcionalidad específica encapsulada

### Gestión de Estado
- **Zustand**: Más simple que Redux, perfecto para MVP
- **Persistencia**: Solo configuraciones guardadas (no estado temporal)
- **Computed values**: Precio calculado dinámicamente

## 🔧 Extensibilidad

### Agregar Nuevas Categorías
```typescript
// En bikeData.ts
export const bikeCategories: CategoryConfig[] = [
  // ... categorías existentes
  {
    id: 'new-category',
    name: 'Nueva Categoría',
    description: 'Descripción...',
    required: true,
    options: [...]
  }
];
```

### Agregar Nuevas Reglas
```typescript
// Reglas de compatibilidad
export const compatibilityRules: CompatibilityRule[] = [
  {
    id: 'nueva-regla',
    description: 'Descripción de la regla',
    condition: (config) => config.someProperty === 'value',
    incompatibleWith: {
      category: 'target-category',
      values: ['incompatible-value']
    }
  }
];
```

## 🎨 Decisiones de UX/UI

### Diseño Visual
- **Paleta de colores**: Azul profesional con acentos
- **Layout responsive**: Grid adaptativo desktop/móvil
- **Feedback inmediato**: Estados de carga, errores, éxito
- **Accesibilidad**: Labels, contraste, navegación por teclado

### Flujo de Usuario
1. **Cargar configuración** (opcional) → 
2. **Seleccionar componentes** → 
3. **Ver precio actualizado** → 
4. **Guardar configuración**

## 📊 Métricas del MVP

- **Tiempo de desarrollo**: ~6 horas
- **Líneas de código**: ~800 líneas
- **Componentes**: 4 componentes principales
- **Tipos TypeScript**: 100% tipado
- **Reglas de negocio**: 2 reglas de compatibilidad + 2 de precios

## 🚀 Próximos Pasos (Post-MVP)

1. **Preview visual**: Integrar imágenes de bicicletas
2. **Base de datos**: Migrar a Supabase
3. **Autenticación**: Sistema de usuarios
4. **Admin panel**: Gestión de componentes y precios
5. **Exportar PDF**: Cotizaciones para clientes

## 🧪 Testing

Para un MVP de 8h, se priorizó funcionalidad sobre testing, pero la arquitectura permite agregar fácilmente:
- Unit tests para funciones puras
- Integration tests para el store
- E2E tests para flujos críticos

---

**Desarrollado por**: Antonio Morales  
**Tiempo invertido**: ~6 horas  
**Fecha**: Mayo 2024
