const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { logger } = require('../utils/logger');

/**
 * 从助记词加载钱包
 * @param {string} mnemonic 助记词
 * @returns {Promise<DirectSecp256k1HdWallet>} 钱包对象
 */
async function loadWallet(mnemonic) {
  try {
    // 若没有提供助记词，尝试从配置加载
    if (!mnemonic) {
      mnemonic = config.account.mnemonic;
      
      // 若配置中也没有，则报错
      if (!mnemonic) {
        throw new Error('No mnemonic provided. Please set MNEMONIC in .env file or provide it directly');
      }
    }
    
    // 创建钱包
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      mnemonic,
      { prefix: config.network.prefix }
    );
    
    return wallet;
  } catch (error) {
    logger.error(`Failed to load wallet: ${error.message}`);
    throw error;
  }
}

/**
 * 从本地账户文件加载账户
 * @param {string} accountIndex 账户索引（例如：'wallet1'）
 * @returns {Promise<{wallet: DirectSecp256k1HdWallet, address: string}>}
 */
async function loadAccountFromFile(accountIndex = 'wallet1') {
  try {
    // 从文件中读取账户信息
    const accountsPath = path.join(process.cwd(), 'accounts.json');
    
    if (!fs.existsSync(accountsPath)) {
      throw new Error(`Account file not found. Run 'npm run setup' first`);
    }
    
    const accounts = JSON.parse(fs.readFileSync(accountsPath, 'utf8'));
    
    if (!accounts[accountIndex]) {
      throw new Error(`Account ${accountIndex} not found in accounts.json`);
    }
    
    // 加载钱包
    const wallet = await loadWallet(accounts[accountIndex].mnemonic);
    const [account] = await wallet.getAccounts();
    
    logger.info(`Loaded account: ${account.address}`);
    
    return {
      wallet,
      address: account.address,
    };
  } catch (error) {
    logger.error(`Failed to load account from file: ${error.message}`);
    throw error;
  }
}

module.exports = { loadWallet, loadAccountFromFile };