# UniBucks - Aptos Token Wallet & Apple Wallet Integration

This application enables users to manage UniBucks tokens on the Aptos blockchain with Apple Wallet integration via PassEntry. It includes a React frontend and serverless API endpoints.

## Features

- UniBucks token management on Aptos blockchain
- Apple Wallet pass generation and management
- Loyalty balance tracking
- API endpoints for minting tokens and managing passes
- Google OAuth authentication for user login

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/) (latest version)
- An Aptos wallet with sufficient funds (for development)
- PassEntry API credentials (for wallet pass functionality)
- Google OAuth credentials (for authentication)

## Configuring Google OAuth

Here are the step-by-step instructions for obtaining OAuth credentials for Google:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/welcome) and sign in to your account.
2. Once you're signed in, click on the project dropdown menu in the top navigation bar and select or create the project you want to use for your OAuth credentials.
3. Click the search bar at the top of the page and search for **"OAuth consent screen"**.
4. Complete the **"Configure Consent Screen"** instructions if you haven't completed this before.
5. On the left, click **"Credentials"**. Towards the top of the screen click the **"Create Credentials"** dropdown and select **"OAuth client ID"**.
6. Select the **"Web application"** application type.
7. Enter a name for your OAuth client ID, such as **"Local Development"**.
8. In the **"Authorized JavaScript origins"** field, enter the origin of your web application: `http://localhost:5173`
9. In the **"Authorized redirect URIs"** field, enter the URI that Google should redirect users to after they authorize your application. This should be: `http://localhost:5173/callback`.
10. Click the **"Create"** button to create your OAuth client ID.
11. After creating your OAuth client ID, you should see a **"Client ID"** and **"Client Secret"** on the **"Credentials"** page. Copy the **"Client ID"** and paste it into `src/core/constants.ts`

That's it! You should now be able to authenticate with Google in your application.

If you need more help with configuring the Google OAuth App check their docs [here](https://support.google.com/cloud/answer/6158849).

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
# Required for token minting
TREASURY_ADDRESS=0x...      # Aptos address that owns the token contract
TREASURY_PRIVATE_KEY=0x...  # Private key for treasury account
TOKEN_ADDRESS=0x...         # Address of the UniBucks token

# Required for PassEntry integration
PASSENTRY_API_URL=https://api.passentry.com  # PassEntry API URL
PASSENTRY_API_KEY=your_api_key               # PassEntry API key
PASSENTRY_TEMPLATE_ID=your_template_id       # PassEntry template ID

# Optional settings
AUTH_TOKEN=your_auth_token     # Token for authenticating mint API requests
APTOS_NETWORK=devnet           # 'devnet' or 'mainnet'
API_BASE_URL=http://localhost:3000  # Base URL for local development
```

## Installation

```bash
# Using npm
npm install

# Using Bun (recommended)
bun install
```

## Development

The application consists of two parts that need to run simultaneously: the frontend React app and the API server.

### Run the complete development environment

```bash
# Using bun (recommended)
bun run dev:all

# Using npm
npm run dev:all
```

This command uses `concurrently` to run both the frontend and API server in a single terminal.

### Run frontend and API separately

**Frontend only:**
```bash
bun run dev
```

**API server only:**
```bash
bun run dev:api
```

The application will be available at http://localhost:5173 with API endpoints at http://localhost:5173/api/*.

## API Endpoints

### `/api/mint`

Mints new UniBucks tokens to a specified wallet.

- **Method:** POST
- **Headers:** `Authorization: Bearer <AUTH_TOKEN>` (if AUTH_TOKEN is set)
- **Body:**
  ```json
  {
    "wallet": "0x...",  // Recipient wallet address
    "amount": 10        // Number of tokens to mint (whole tokens)
  }
  ```

### `/api/pass`

Manages Apple Wallet passes.

- **GET:** Retrieves a pass for a wallet
- **POST:** Creates a new pass for a wallet
- **PATCH:** Updates a pass balance

## Deployment

### Vercel

This project is configured for Vercel deployment. Simply push to your connected repository or deploy using the Vercel CLI:

```bash
vercel
```

Make sure to configure the environment variables in the Vercel dashboard.

### Other Platforms

For other platforms, ensure you set up the environment variables and run the build command:

```bash
bun run build
```

The built frontend will be in the `dist` directory, and API endpoints are in the `api` directory.

## Testing Token Minting

You can test token minting directly with:

```bash
bun direct-mint-test.js
```

This requires your environment variables to be properly configured.

## License

[MIT License](LICENSE)