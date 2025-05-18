const fs = require('fs');
const path = require('path');
const { createValidator } = require('../src/mining/create-validator');
const { getValidators, getValidatorInfo } = require('../src/mining/validators');
const { loadAccountFromFile } = require('../src/account/load');
const { StargateClient } = require('@cosmjs/stargate');
const { logger } = require('../src/utils/logger');
const config = require('../config');

/**
 * 运行挖矿示例
 */
async function runMining() {
  try {
    logger.section('Running Mining (Validator) Example');
    
    // 检查账户是否已创建
    const accountsPath = path.join(process.cwd(), 'accounts.json');
    
    if (!fs.existsSync(accountsPath)) {
      throw new Error('Accounts file not found. Run "npm run setup" first');
    }
    
    const accounts = JSON.parse(fs.readFileSync(accountsPath, 'utf8'));
    
    // 获取账户1
    const { wallet: wallet1, address: operator } = await loadAccountFromFile('wallet1');
    
    // 查询操作员余额
    const client = await StargateClient.connect(config.network.rpcEndpoint);
    const balance = await client.getAllBalances(operator);
    
    logger.info(`Operator (${operator}) balance: ${JSON.stringify(balance)}`);
    
    // 检查余额是否足够
    const minSelfDelegation = config.MIN_SELF_DELEGATION || '1000000';
    const hasTokens = balance.some(
      coin => coin.denom === config.network.denom && parseInt(coin.amount) >= parseInt(minSelfDelegation)
    );
    
    // 首先，让我们探索网络上的验证者
    logger.info('Exploring validators on the network...');
    
    // 获取活跃验证者列表
    const activeValidators = await getValidators('BOND_STATUS_BONDED');
    logger.info(`Found ${activeValidators.length} active validators`);
    
    // 显示前3个验证者的基本信息
    const topValidators = activeValidators.slice(0, 3);
    for (const [index, validator] of topValidators.entries()) {
      logger.info(`Validator ${index + 1}: ${validator.moniker} (${validator.operatorAddress})`);
      logger.info(`  Tokens: ${validator.tokens}`);
      logger.info(`  Commission rate: ${parseFloat(validator.commission) * 100}%`);
      
      // 获取更详细的验证者信息
      if (index === 0) {
        try {
          const validatorInfo = await getValidatorInfo(validator.operatorAddress);
          logger.info(`  Estimated APR: ${validatorInfo.estimatedAPR}`);
        } catch (error) {
          logger.warn(`  Could not fetch detailed info: ${error.message}`);
        }
      }
    }
    
    // 模拟创建验证者流程
    logger.info('\nSimulating validator creation process...');
    
    if (!hasTokens) {
      logger.warn(`Insufficient ${config.network.denom} tokens for real validator creation. This will be a simulation only.`);
    }
    
    // 验证者信息
    const validatorInfo = {
      moniker: 'MyCosmosValidator',
      identity: '',
      website: 'https://example.com',
      securityContact: 'security@example.com',
      details: 'A test validator created with CosmJS',
      commission: '0.10', // 10% commission
    };
    
    // 执行创建验证者模拟
    const result = await createValidator(
      accounts.wallet1.mnemonic,
      validatorInfo,
      '1000000', // 自质押金额
      config.network.denom
    );
    
    logger.success('Mining (validator) example completed');
    logger.info('This was a simulated run. In a real network, you would need to:');
    logger.info('1. Run a full node that is synced with the network');
    logger.info('2. Create a validator public key from your node');
    logger.info('3. Submit a create-validator transaction');
    logger.info('4. Ensure your node stays online to participate in consensus');
    
    return result;
  } catch (error) {
    logger.error(`Mining example failed: ${error.message}`);
    process.exit(1);
  }
}

// 直接运行脚本时执行
if (require.main === module) {
  runMining();
}

module.exports = { runMining };