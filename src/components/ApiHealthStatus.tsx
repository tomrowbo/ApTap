import { useEffect, useState } from 'react';
import apiService from '../services/ApiService';

interface ApiHealthStatusProps {
  showDetails?: boolean;
}

export default function ApiHealthStatus({ showDetails = false }: ApiHealthStatusProps) {
  const [health, setHealth] = useState<{
    status: string;
    environment: string;
    configured: boolean;
    lastChecked: string | null;
  }>({
    status: 'loading',
    environment: '',
    configured: false,
    lastChecked: null,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkApiHealth = async () => {
      setLoading(true);
      try {
        const healthData = await apiService.checkHealth();
        setHealth({
          status: healthData.status,
          environment: healthData.environment,
          configured: healthData.api.configured,
          lastChecked: healthData.timestamp,
        });
      } catch (error) {
        console.error('Failed to check API health:', error);
        setHealth({
          status: 'error',
          environment: 'unknown',
          configured: false,
          lastChecked: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    checkApiHealth();
    // Check health every 5 minutes
    const interval = setInterval(checkApiHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Status indicators
  const getStatusIndicator = () => {
    if (loading) return '🔄';
    if (health.status === 'ok' && health.configured) return '✅';
    if (health.status === 'ok' && !health.configured) return '⚠️';
    return '❌';
  };

  // Format timestamp
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  if (!showDetails) {
    return (
      <div className="inline-flex items-center gap-1 text-xs">
        <span>{getStatusIndicator()}</span>
        <span className="opacity-70">API</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
        <span>{getStatusIndicator()}</span>
        API Status
      </h3>
      
      {loading ? (
        <p className="text-xs text-gray-500">Checking API status...</p>
      ) : (
        <div className="text-xs space-y-1">
          <p><span className="text-gray-500">Status:</span> {health.status}</p>
          <p><span className="text-gray-500">Environment:</span> {health.environment}</p>
          <p>
            <span className="text-gray-500">API Credentials:</span> 
            {health.configured ? 'Configured' : 'Not configured'}
          </p>
          <p><span className="text-gray-500">Last checked:</span> {formatTime(health.lastChecked)}</p>
        </div>
      )}
    </div>
  );
} 