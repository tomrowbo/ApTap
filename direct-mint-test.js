// Direct test of minting functionality (no API involved)
import { Account, AccountAddress, Aptos, AptosConfig, Network, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Treasury information from environment variables
const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || "0x12d4853fbce0160fb808c672475839cf508cc09b0dc5be199c457f4b566f7589";
const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY || "ed25519-priv-0x280d091793867d0da41554720a30dae91cb59b1964014e8096dacef0b234c976";
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "0x2408c3efa13aa42e9afeb4735d78af275dd496c1bce5b081fdbc476dae5d9707";
const DECIMALS = parseInt(process.env.TOKEN_DECIMALS || "8");

// Recipient wallet - modify this to whatever address you want to test with
const RECIPIENT_WALLET = process.env.RECIPIENT_WALLET || TREASURY_ADDRESS; // Default to treasury address if not specified
const AMOUNT = parseFloat(process.env.MINT_AMOUNT || "1"); // Amount of tokens to mint

// Set up the client
const config = new AptosConfig({ network: process.env.APTOS_NETWORK ? (process.env.APTOS_NETWORK.toLowerCase() === 'mainnet' ? Network.MAINNET : Network.DEVNET) : Network.DEVNET });
const aptos = new Aptos(config);

// Direct port of mintCoin function from your_fungible_asset.ts
async function mintCoin(admin, receiverAddress, amount) {
  console.log(`Minting ${Number(amount) / Math.pow(10, DECIMALS)} tokens from ${admin.accountAddress.toString()} to ${receiverAddress.toString()}`);
  
  const transaction = await aptos.transaction.build.simple({
    sender: admin.accountAddress,
    data: {
      function: `${admin.accountAddress.toString()}::fa_coin::mint`,
      functionArguments: [receiverAddress, amount],
    },
  });

  console.log("Transaction built, signing and submitting...");
  const senderAuthenticator = aptos.transaction.sign({ signer: admin, transaction });
  const pendingTxn = await aptos.transaction.submit.simple({ transaction, senderAuthenticator });
  
  console.log(`Transaction submitted: ${pendingTxn.hash}`);
  return pendingTxn.hash;
}

async function checkBalance(walletAddress, tokenAddress) {
  try {
    console.log(`Checking balance for wallet: ${walletAddress.toString()}, token: ${tokenAddress}`);
    
    // Try using the direct view function with explicit type argument for the fungible store
    const payload = {
      function: "0x1::primary_fungible_store::balance",
      typeArguments: [tokenAddress],
      functionArguments: [
        walletAddress
      ],
    };
    
    console.log("Sending view request with payload:", JSON.stringify(payload));
    const balance = await aptos.view({ payload });
    console.log("Raw balance response:", balance);
    
    const formattedBalance = Number(balance[0]) / Math.pow(10, DECIMALS);
    console.log(`Balance check: ${formattedBalance} tokens`);
    return formattedBalance;
  } catch (error) {
    console.error(`Balance check error: ${error.message}`);
    if (error.stack) {
      console.error("Error stack:", error.stack);
    }
    
    // Try alternative approach - get fungible asset balances
    try {
      console.log("Trying alternative approach - get fungible asset balances...");
      const balances = await aptos.getFungibleAssetBalances({
        ownerAddress: walletAddress
      });
      
      console.log("All fungible asset balances:", balances);
      
      // Find the specific token balance
      const targetAsset = balances.find(b => b.asset_type.includes(tokenAddress));
      if (targetAsset) {
        const assetBalance = Number(targetAsset.amount) / Math.pow(10, DECIMALS);
        console.log(`Found asset balance using alternative method: ${assetBalance} tokens`);
        return assetBalance;
      } else {
        console.log("Token not found in user's balances");
      }
    } catch (altError) {
      console.error("Alternative method also failed:", altError.message);
    }
    
    return null;
  }
}

// Main function
async function main() {
  try {
    console.log("=== Starting Direct Mint Test ===");
    console.log(`Network: ${config.network}`);
    console.log(`Treasury Address: ${TREASURY_ADDRESS}`);
    console.log(`Token Address: ${TOKEN_ADDRESS}`);
    console.log(`Recipient Wallet: ${RECIPIENT_WALLET}`);
    console.log(`Amount to mint: ${AMOUNT} tokens (${AMOUNT * Math.pow(10, DECIMALS)} base units)`);
    
    // Create treasury account from private key
    console.log("\n=== Creating treasury account ===");
    
    // Clean up the private key format
    let cleanPrivateKey = TREASURY_PRIVATE_KEY;
    if (cleanPrivateKey.startsWith('ed25519-priv-0x')) {
      cleanPrivateKey = cleanPrivateKey.substring('ed25519-priv-0x'.length);
    }
    if (!cleanPrivateKey.startsWith('0x')) {
      cleanPrivateKey = '0x' + cleanPrivateKey;
    }
    
    // Create the private key object and account
    const privateKeyBytes = Uint8Array.from(
      Buffer.from(cleanPrivateKey.replace('0x', ''), 'hex')
    );
    const privateKey = new Ed25519PrivateKey(privateKeyBytes);
    const treasury = Account.fromPrivateKey({ privateKey });
    
    console.log(`Treasury account created with address: ${treasury.accountAddress.toString()}`);
    
    // Create recipient address
    const recipientAddress = AccountAddress.fromString(RECIPIENT_WALLET);
    
    // Convert to base units
    const baseAmount = BigInt(Math.floor(AMOUNT * Math.pow(10, DECIMALS)));
    
    // Check initial balance
    console.log("\n=== Checking Initial Balance ===");
    const initialBalance = await checkBalance(recipientAddress, TOKEN_ADDRESS);
    
    // Mint tokens
    console.log("\n=== Minting Tokens ===");
    const txHash = await mintCoin(treasury, recipientAddress, baseAmount);
    
    // Wait for transaction to complete
    console.log("\n=== Waiting for Transaction ===");
    const txResult = await aptos.waitForTransaction({ transactionHash: txHash });
    console.log(`Transaction status: ${txResult.success ? 'SUCCESS' : 'FAILED'}`);
    const networkUrlPart = config.network === Network.MAINNET ? 'mainnet' : 'devnet';
    console.log(`Explorer URL: https://explorer.aptoslabs.com/txn/${txHash}?network=${networkUrlPart}`);
    
    if (!txResult.success) {
      console.error("Transaction failed:", txResult.vm_status);
      return;
    }
    
    // Wait a bit for state to update
    console.log("Waiting 2 seconds for blockchain state to update...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check final balance
    console.log("\n=== Checking Final Balance ===");
    const finalBalance = await checkBalance(recipientAddress, TOKEN_ADDRESS);
    
    // Show change
    console.log(`\nBalance change: ${initialBalance} -> ${finalBalance}`);
    console.log(`Expected increase: ${AMOUNT} tokens`);
    
    console.log("\n=== Transaction successful! ===");
    console.log(`Minted ${AMOUNT} tokens from treasury to ${RECIPIENT_WALLET}`);
    console.log("Note: Balance queries may not show updated balances immediately as the blockchain state takes time to update.");
    console.log("\n=== Test Complete ===");
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

// Run the test
main(); 