const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { logger } = require('../src/utils/logger');
const config = require('../config');

/**
 * 从测试网水龙头获取测试代币
 */
async function getTestTokens() {
  try {
    logger.section('Getting Test Tokens');
    
    // 检查账户是否已创建
    const accountsPath = path.join(process.cwd(), 'accounts.json');
    
    if (!fs.existsSync(accountsPath)) {
      throw new Error('Accounts file not found. Run "npm run setup" first');
    }
    
    const accounts = JSON.parse(fs.readFileSync(accountsPath, 'utf8'));
    
    // 检查水龙头URL
    if (!config.faucet.url) {
      throw new Error('Faucet URL not configured. Set FAUCET_URL in your .env file');
    }
    
    // 为每个账户获取测试代币
    for (const [accountKey, accountData] of Object.entries(accounts)) {
      logger.info(`Requesting tokens for ${accountKey}: ${accountData.address}`);
      
      try {
        const response = await axios.post(config.faucet.url, {
          address: accountData.address,
          denom: config.network.denom
        });
        
        logger.success(`Successfully requested tokens for ${accountData.address}`);
        logger.info('It may take a few moments for tokens to arrive');
      } catch (error) {
        logger.warn(`Failed to request tokens automatically: ${error.message}`);
        logger.info(`Please visit ${config.faucet.url} and manually request tokens for ${accountData.address}`);
      }
    }
    
    logger.success('Token request process completed');
    logger.info('Next steps:');
    logger.info('1. Wait a few moments for tokens to arrive');
    logger.info('2. Run "npm run transfer" to test token transfers');
  } catch (error) {
    logger.error(`Failed to get test tokens: ${error.message}`);
    process.exit(1);
  }
}

// 直接运行脚本时执行
if (require.main === module) {
  getTestTokens();
}

module.exports = { getTestTokens };