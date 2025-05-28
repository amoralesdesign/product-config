import { useBikeStore } from '../store/bikeStore';
import { bikeCategories } from '../data/bikeData';
import { ComponentSelector } from './ComponentSelector';
import { PriceSummary } from './PriceSummary';
import { LoadConfiguration } from './LoadConfiguration';

export function BikeConfigurator() {
  const { currentConfig, updateComponent } = useBikeStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Famous Markus' Bike Configurator
          </h1>
          <p className="text-lg text-gray-600">
            Configure your perfect custom bike
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            <LoadConfiguration />
            
            {bikeCategories
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((category) => (
                <ComponentSelector
                  key={category.id}
                  category={category}
                  selectedValue={currentConfig.components?.[category.id] || null}
                  onSelectionChange={(value) => updateComponent(category.id, value)}
                />
              ))}
          </div>

          {/* Price Summary Panel */}
          <div className="lg:col-span-1">
            <PriceSummary />
          </div>
        </div>
      </div>
    </div>
  );
} 