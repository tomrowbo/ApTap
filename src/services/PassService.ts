interface PassResponse {
  passUrl: string | null;
  status: number;
}

interface PassServiceError extends Error {
  details?: string;
}

export class PassService {
  private readonly API_BASE_URL = '/api/pass';
  private readonly isDev = import.meta.env.DEV === true;
  private useRealApi = false;
  
  constructor() {
    // Check if we should use the real API by testing the health endpoint
    if (this.isDev) {
      fetch('/api/health')
        .then(response => response.json())
        .then(data => {
          console.log('API health check response:', data);
          // If we get a successful response, use the real API
          this.useRealApi = true;
          console.log('API server detected, using real API endpoints');
        })
        .catch(() => {
          console.log('No API server detected, using mock data');
        });
    }
  }
  
  async getWalletPass(walletAddress: string) {
    // For development, mock the API response only if API server is not running
    if (this.isDev && !this.useRealApi) {
      console.log('Using mock data for getWalletPass in development');
      return {
        passUrl: null, // Return null to trigger the createWalletPass flow on first run
        status: 200,
      };
    }
    
    try {
      const response = await fetch(`${this.API_BASE_URL}?walletAddress=${walletAddress}`, {
        method: 'GET',
      });

      if (!response.ok && response.status !== 404) {
        const errorData = await response.text();
        console.error('Error getting pass:', {
          status: response.status,
          error: errorData
        });
        throw new Error(`Failed to get wallet pass: ${errorData}`);
      }

      // If the pass wasn't found, return null passUrl
      if (response.status === 404) {
        return {
          passUrl: null,
          status: 404
        };
      }

      const data = await response.json() as PassResponse;
      return data;
    } catch (error) {
      console.error('Error getting pass:', error);
      throw error;
    }
  }

  async createWalletPass(walletAddress: string) {
    // For development, mock the API response only if API server is not running
    if (this.isDev && !this.useRealApi) {
      console.log('Using mock data for createWalletPass in development');
      return {
        passUrl: 'https://example.com/mock-wallet-pass.pkpass',
        status: 201,
      };
    }
    
    try {
      const response = await fetch(`${this.API_BASE_URL}?walletAddress=${walletAddress}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Wallet pass creation failed:', {
          status: response.status,
          error: errorData
        });
        const error: PassServiceError = new Error('Failed to create wallet pass');
        error.details = errorData;
        throw error;
      }

      const data = await response.json() as PassResponse;
      return data;
    } catch (error) {
      if (!(error instanceof Error) || !('details' in error)) {
        console.error('Wallet pass creation failed:', error);
        const wrappedError: PassServiceError = new Error('Failed to create wallet pass');
        wrappedError.details = error instanceof Error ? error.message : 'Unknown error';
        throw wrappedError;
      }
      throw error;
    }
  }

  async updatePassBalance(walletAddress: string, balance: number) {
    // For development, mock the API response only if API server is not running
    if (this.isDev && !this.useRealApi) {
      console.log(`Using mock data for updatePassBalance in development (${walletAddress}, ${balance})`);
      return {
        status: 200,
        success: true
      };
    }
    
    try {
      const response = await fetch(`${this.API_BASE_URL}?walletAddress=${walletAddress}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          balance
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Pass balance update failed:', {
          status: response.status,
          error: errorData
        });
        const error: PassServiceError = new Error('Failed to update pass balance');
        error.details = errorData;
        throw error;
      }

      const data = await response.json();
      return {
        status: data.status,
        success: true
      };
    } catch (error) {
      if (!(error instanceof Error) || !('details' in error)) {
        console.error('Pass balance update failed:', error);
        const wrappedError: PassServiceError = new Error('Failed to update pass balance');
        wrappedError.details = error instanceof Error ? error.message : 'Unknown error';
        throw wrappedError;
      }
      throw error;
    }
  }
}

const passService = new PassService();
export default passService; 