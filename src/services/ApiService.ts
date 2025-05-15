interface HealthResponse {
  status: string;
  timestamp: string;
  environment: string;
  api: {
    configured: boolean;
    credentials: {
      apiUrl: boolean;
      apiKey: boolean;
      templateId: boolean;
    }
  };
  version: string;
  note?: string;
}

/**
 * Service for general API operations
 */
export class ApiService {
  private readonly isDev = import.meta.env.DEV === true;

  /**
   * Check if the API is healthy and properly configured
   * @returns Promise with health check data
   */
  async checkHealth(): Promise<HealthResponse> {
    try {
      // In development, we can use the static JSON file if the API isn't working
      const url = this.isDev ? '/api/health/index.json' : '/api/health';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Health check failed with status: ${response.status}`);
      }
      
      return await response.json() as HealthResponse;
    } catch (error) {
      console.error('API health check failed:', error);
      // Return an error status that can be displayed
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        environment: 'unknown',
        api: {
          configured: false,
          credentials: {
            apiUrl: false,
            apiKey: false,
            templateId: false
          }
        },
        version: 'unknown',
        note: 'Generated error response due to failed health check'
      };
    }
  }
}

const apiService = new ApiService();
export default apiService; 