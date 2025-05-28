import { useBikeStore } from '../store/bikeStore';
import { bikeCategories } from '../data/bikeData';
import { bikeConfigService } from '../services/bikeConfigService';
import { Save, RotateCcw, ShoppingCart } from 'lucide-react';

export function PriceSummary() {
  const { 
    currentConfig, 
    calculatePrice, 
    saveConfiguration, 
    resetConfiguration,
    getDynamicPrice
  } = useBikeStore();

  const totalPrice = calculatePrice();
  const hasSelection = Object.values(currentConfig.components || {}).some(value => value !== null);
  const isComplete = bikeConfigService.isConfigurationComplete(currentConfig);
  const missingCategories = bikeConfigService.getMissingCategories(currentConfig);

  const handleSave = () => {
    const configId = saveConfiguration();
    alert(`Configuration saved with ID: ${configId}`);
  };

  const handleOrderBike = () => {
    if (!isComplete) {
      alert('Please complete all options before ordering the bike.');
      return;
    }
    
    const configId = saveConfiguration();
    const summary = bikeConfigService.getConfigurationSummary(currentConfig);
    alert(`Order placed successfully!\n\nConfiguration ID: ${configId}\n\n${summary}`);
  };

  const getSelectedOptionDetails = () => {
    return bikeCategories.map(category => {
      const selectedValue = currentConfig.components?.[category.id];
      const selectedOption = selectedValue 
        ? category.options.find(opt => opt.value === selectedValue)
        : null;

      // Obtener precio dinámico si hay una opción seleccionada
      const dynamicPrice = selectedValue ? getDynamicPrice(category.id, selectedValue) : null;
      const basePrice = selectedOption?.price || 0;
      const priceChanged = dynamicPrice !== null && dynamicPrice !== basePrice;

      return {
        category: category.name,
        categoryObj: category, // Agregamos el objeto completo
        option: selectedOption,
        selected: !!selectedOption,
        dynamicPrice,
        basePrice,
        priceChanged
      };
    });
  };

  return (
    <div className="card sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Configuration Summary
      </h2>

      <div className="space-y-4 mb-6">
        {getSelectedOptionDetails().map(({ category, categoryObj, option, selected, dynamicPrice, basePrice, priceChanged }) => (
          <div key={category} className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">{category}</span>
              {selected && option && (
                <div className="text-xs text-gray-500">{option.label}</div>
              )}
              {!selected && (
                <div className={`text-xs ${categoryObj.required ? 'text-red-500' : 'text-gray-400'}`}>
                  {categoryObj.required ? '⚠ Required' : 'Optional'}
                </div>
              )}
            </div>
            <div className="text-right">
              {selected && option ? (
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-semibold ${priceChanged ? 'text-primary-600' : 'text-gray-900'}`}>
                    {dynamicPrice} EUR
                  </span>
                  {priceChanged && (
                    <span className="text-xs text-gray-400 line-through">
                      {basePrice} EUR
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-gray-400">Not selected</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-primary-600">
            {totalPrice} EUR
          </span>
        </div>
      </div>

      {/* Configuration status */}
      {!isComplete && missingCategories.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700 font-medium mb-1">
            Missing {missingCategories.length} selections:
          </p>
          <ul className="text-xs text-yellow-600">
            {missingCategories.map(categoryId => {
              const category = bikeCategories.find(cat => cat.id === categoryId);
              return category ? <li key={categoryId}>• {category.name}</li> : null;
            })}
          </ul>
        </div>
      )}

      {isComplete && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-700 font-medium">
            ✅ Configuration complete - Ready to order
          </p>
        </div>
      )}

      <div className="space-y-3">
        {/* Primary button: Order bike */}
        <button
          onClick={handleOrderBike}
          disabled={!isComplete}
          className={`
            w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors
            ${isComplete 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <ShoppingCart size={18} />
          {isComplete ? 'Order Bike' : `Missing ${missingCategories.length} selections`}
        </button>

        {/* Secondary button: Save configuration */}
        <button
          onClick={handleSave}
          disabled={!hasSelection}
          className={`
            w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors
            ${hasSelection 
              ? 'bg-primary-600 hover:bg-primary-700 text-white' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <Save size={16} />
          Save Configuration
        </button>

        {/* Tertiary button: Reset */}
        <button
          onClick={resetConfiguration}
          disabled={!hasSelection}
          className={`
            w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors
            ${hasSelection 
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {!hasSelection && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 Select components to configure your custom bike.
          </p>
        </div>
      )}
    </div>
  );
} 