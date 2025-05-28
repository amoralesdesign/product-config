import { useState } from 'react';
import { useBikeStore } from '../store/bikeStore';
import { Upload, Search } from 'lucide-react';

export function LoadConfiguration() {
  const [configId, setConfigId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { loadConfiguration, savedConfigurations } = useBikeStore();

  const handleLoad = async () => {
    if (!configId.trim()) {
      setMessage({ type: 'error', text: 'Please enter a configuration ID' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // Simulate a small delay for UX
    setTimeout(() => {
      const success = loadConfiguration(configId.trim());
      
      if (success) {
        setMessage({ type: 'success', text: 'Configuration loaded successfully' });
        setConfigId('');
      } else {
        setMessage({ type: 'error', text: 'No configuration found with that ID' });
      }
      
      setIsLoading(false);
    }, 500);
  };

  const handleQuickLoad = (id: string) => {
    setConfigId(id);
    const success = loadConfiguration(id);
    if (success) {
      setMessage({ type: 'success', text: 'Configuration loaded successfully' });
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Upload size={20} className="text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Load Configuration
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="config-id" className="block text-sm font-medium text-gray-700 mb-2">
            Configuration ID
          </label>
          <div className="flex gap-2">
            <input
              id="config-id"
              type="text"
              value={configId}
              onChange={(e) => setConfigId(e.target.value.toUpperCase())}
              placeholder="e.g. MK03403"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isLoading}
            />
            <button
              onClick={handleLoad}
              disabled={isLoading || !configId.trim()}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                ${isLoading || !configId.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
                }
              `}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Load
            </button>
          </div>
        </div>

        {message && (
          <div className={`
            p-3 rounded-lg text-sm
            ${message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
            }
          `}>
            {message.text}
          </div>
        )}

        {savedConfigurations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Saved Configurations ({savedConfigurations.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {savedConfigurations.slice(-5).reverse().map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <div className="font-medium text-sm text-gray-900">
                      {config.id}
                    </div>
                    <div className="text-xs text-gray-500">
                      {config.totalPrice} EUR • {new Date(config.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuickLoad(config.id)}
                    className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded hover:bg-primary-200 transition-colors"
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 