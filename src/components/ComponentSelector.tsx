import type { CategoryConfig } from '../types/bike';
import { useBikeStore } from '../store/bikeStore';

interface ComponentSelectorProps {
  category: CategoryConfig;
  selectedValue: string | null;
  onSelectionChange: (value: string) => void;
}

export function ComponentSelector({
  category,
  selectedValue,
  onSelectionChange,
}: ComponentSelectorProps) {
  const { isOptionDisabled, getDynamicPrice } = useBikeStore();

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {category.name}
          {category.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        <p className="text-sm text-gray-600">{category.description}</p>
      </div>

      <div className="space-y-3">
        {category.options.map((option) => {
          const isSelected = selectedValue === option.value;
          const isDisabled = isOptionDisabled(category.id, option.value);
          const dynamicPrice = getDynamicPrice(category.id, option.value);
          const priceChanged = dynamicPrice !== option.price;

          return (
            <div
              key={option.value}
              className={`
                relative border rounded-lg p-4 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500' 
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${isDisabled 
                  ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                  : 'hover:shadow-sm'
                }
              `}
              onClick={() => {
                if (!isDisabled) {
                  onSelectionChange(option.value);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={category.id}
                      value={option.value}
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => {}} // Manejado por el onClick del div
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-900">
                      {option.label}
                    </label>
                  </div>
                  {option.description && (
                    <p className="mt-1 text-xs text-gray-500 ml-7">
                      {option.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-semibold ${priceChanged ? 'text-primary-600' : 'text-gray-900'}`}>
                      {dynamicPrice} EUR
                    </span>
                    {priceChanged && (
                      <span className="text-xs text-gray-400 line-through">
                        {option.price} EUR
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {isDisabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 rounded-lg">
                  <span className="text-xs text-gray-500 font-medium">
                    Not compatible
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 