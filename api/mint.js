// Import Aptos SDK
import { Account, AccountAddress, Aptos, AptosConfig, Network, InputViewFunctionData } from "@aptos-labs/ts-sdk";
import fetch from 'node-fetch';

async function mintCoin(aptos, admin, receiverAddress, amount) {
  const transaction = await aptos.transaction.build.simple({
    sender: admin.accountAddress,
    data: {
      function: `${admin.accountAddress}::fa_coin::mint`,
      functionArguments: [receiverAddress, amount],
    },
  });

  const senderAuthenticator = aptos.transaction.sign({ signer: admin, transaction });
  const pendingTxn = await aptos.transaction.submit.simple({ transaction, senderAuthenticator });

  return pendingTxn.hash;
}

/**
 * Check balance of a wallet for the token
 */
async function checkBalance(aptos, walletAddress, tokenAddress, decimals) {
  try {
    // Try using the direct view function
    const payload = {
      function: "0x1::primary_fungible_store::balance",
      functionArguments: [
        AccountAddress.fromString(walletAddress),
        AccountAddress.fromString(tokenAddress)
      ],
    };
    
    const balance = await aptos.view({ payload });
    const formattedBalance = Number(balance[0]) / Math.pow(10, decimals);
    console.log(`[mint] Direct balance check: ${formattedBalance} tokens`);
    return formattedBalance;
  } catch (error) {
    console.error(`[mint] Balance check error: ${error.message}`);
    return null;
  }
}

/**
 * Update loyalty pass balance directly via the PassEntry API
 */
async function updatePassBalance(walletAddress, balance) {
  try {
    console.log(`[mint] Updating PassEntry loyalty balance for ${walletAddress} to ${balance}`);
    
    const API_URL = process.env.PASSENTRY_API_URL;
    const API_KEY = process.env.PASSENTRY_API_KEY;
    
    if (!API_URL || !API_KEY) {
      throw new Error('PassEntry API credentials not configured');
    }
    
    // Call PassEntry API directly
    const response = await fetch(`${API_URL}/api/v1/loyalty/${walletAddress}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        overrideBalance: balance
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('[mint] PassEntry loyalty update failed:', {
        status: response.status,
        error: errorData
      });
      throw new Error(`Failed to update PassEntry loyalty balance: ${errorData}`);
    }
    
    console.log('[mint] PassEntry loyalty balance updated successfully');
    return { 
      success: true, 
      status: response.status 
    };
  } catch (error) {
    console.error('[mint] PassEntry loyalty update failed:', error);
    throw error;
  }
}

/**
 * Mint endpoint for UniBucks tokens
 * 
 * Request body parameters:
 * - wallet: Recipient wallet address
 * - amount: Amount of tokens to mint (in whole tokens)
 * 
 * Headers:
 * - Authorization: Bearer [AUTH_TOKEN from env]
 */
export default async function handler(req, res) {
  // Simplified CORS headers to reduce header size
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get environment variables
  const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS;
  const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY;
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
  const AUTH_TOKEN = process.env.AUTH_TOKEN;
  const NETWORK = (process.env.APTOS_NETWORK || "devnet").toLowerCase();

  const DECIMALS = 8
  
  // Check for required environment variables
  if (!TREASURY_ADDRESS || !TREASURY_PRIVATE_KEY || !TOKEN_ADDRESS) {
    console.error('[mint] Missing required environment variables');
    return res.status(500).json({ error: 'Server configuration error: Missing required environment variables' });
  }

  if (!AUTH_TOKEN) {
    console.warn('[mint] Warning: AUTH_TOKEN not set, authentication disabled');
  }

  try {
    console.log("[mint] Request received");
    
    // Validate auth token if set
    if (AUTH_TOKEN) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== AUTH_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    // Parse request body
    const { wallet, amount } = req.body;
    if (!wallet || !amount) {
      return res.status(400).json({ error: 'Wallet address and amount are required' });
    }

    // Validate amount
    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Convert to base units (accounting for decimals)
    const baseUnits = BigInt(Math.floor(amountNumber * Math.pow(10, DECIMALS)));
    console.log(`[mint] Minting ${amountNumber} tokens (${baseUnits} base units) to ${wallet}`);

    // Set up Aptos client
    const networkConfig = NETWORK === 'mainnet' ? Network.MAINNET : Network.DEVNET;
    console.log(`[mint] Using Aptos network: ${networkConfig}`);
    const config = new AptosConfig({ network: networkConfig });
    const aptos = new Aptos(config);

    // Create treasury account from private key
    const treasury = Account.fromPrivateKeyHex(TREASURY_PRIVATE_KEY);
    console.log(`[mint] Treasury address: ${treasury.accountAddress.toString()}`);

    // Create recipient account address
    const receiverAddress = AccountAddress.fromString(wallet);
    
    // Check initial balance before minting
    const initialBalance = await checkBalance(aptos, wallet, TOKEN_ADDRESS, DECIMALS) || 0;
    console.log(`[mint] Initial balance: ${initialBalance} tokens`);
    
    // Mint tokens using the same function as in your_fungible_asset.ts
    console.log("[mint] Calling mintCoin function");
    const txnHash = await mintCoin(aptos, treasury, receiverAddress, baseUnits);
    console.log(`[mint] Transaction submitted: ${txnHash}`);

    // Wait for transaction confirmation
    const txnResult = await aptos.waitForTransaction({ transactionHash: txnHash });
    
    // Log transaction details more clearly
    console.log(`[mint] ===== TRANSACTION COMPLETE =====`);
    console.log(`[mint] Transaction hash: ${txnHash}`);
    const explorerBaseUrl = NETWORK === 'mainnet' 
      ? 'https://explorer.aptoslabs.com/txn/' 
      : 'https://explorer.aptoslabs.com/txn/';
    const explorerUrl = `${explorerBaseUrl}${txnHash}?network=${NETWORK}`;
    console.log(`[mint] Explorer URL: ${explorerUrl}`);
    console.log(`[mint] Status: ${txnResult.success ? 'SUCCESS' : 'FAILED'}`);
    
    // Check transaction status
    if (txnResult.success === false) {
      console.error(`[mint] Transaction failed with VM status: ${txnResult.vm_status}`);
      return res.status(500).json({
        success: false,
        error: 'Transaction failed on-chain',
        transaction: txnHash,
        explorerUrl,
        status: txnResult.vm_status
      });
    }
    
    // Calculate new balance directly (initial + amount) instead of waiting and checking
    const calculatedBalance = initialBalance + amountNumber;
    console.log(`[mint] Calculated new balance: ${calculatedBalance} tokens (${initialBalance} + ${amountNumber})`);
    
    // Update loyalty pass balance after successful mint
    let passUpdateSuccess = false;
    try {
      await updatePassBalance(wallet, calculatedBalance);
      passUpdateSuccess = true;
      console.log(`[mint] PassEntry loyalty balance updated for ${wallet} to ${calculatedBalance}`);
    } catch (passError) {
      console.error(`[mint] Failed to update PassEntry loyalty balance: ${passError.message}`);
      // We don't fail the whole request if pass update fails
    }
    
    // Add token information to the response
    return res.status(200).json({
      success: true,
      transaction: txnHash,
      explorerUrl,
      recipient: wallet,
      amount: amountNumber,
      tokenAddress: TOKEN_ADDRESS,
      previousBalance: initialBalance,
      calculatedBalance: calculatedBalance,
      passUpdated: passUpdateSuccess,
      txnInfo: {
        hash: txnHash,
        status: txnResult.success ? 'SUCCESS' : 'FAILED',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error(`[mint] Error: ${error.message}`);
    console.error(error.stack);
    return res.status(500).json({ 
      error: 'An error occurred while minting tokens',
      message: error.message
    });
  }
} 