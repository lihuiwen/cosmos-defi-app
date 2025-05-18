const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { logger } = require('../utils/logger');

/**
 * 创建测试账户
 * @param {number} count 要创建的账户数量
 * @returns {Promise<Object>} 账户信息对象
 */
async function createAccounts(count = 2) {
  logger.info(`Creating ${count} test accounts...`);
  
  const accounts = {};
  
  for (let i = 1; i <= count; i++) {
    // 生成新钱包
    const wallet = await DirectSecp256k1HdWallet.generate(12, { 
      prefix: config.network.prefix 
    });
    
    // 获取地址
    const [account] = await wallet.getAccounts();
    
    accounts[`wallet${i}`] = {
      mnemonic: wallet.mnemonic,
      address: account.address
    };
    
    logger.info(`Created Account ${i}: ${account.address}`);
  }
  
  // 保存到文件
  const accountsPath = path.join(process.cwd(), 'accounts.json');
  fs.writeFileSync(accountsPath, JSON.stringify(accounts, null, 2));
  logger.info(`Accounts saved to ${accountsPath}`);
  
  return accounts;
}

module.exports = { createAccounts };