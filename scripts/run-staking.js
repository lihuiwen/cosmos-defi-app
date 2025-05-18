const fs = require('fs');
const path = require('path');
const { delegateTokens } = require('../src/staking/delegate');
const { getValidators } = require('../src/mining/validators');
const { loadAccountFromFile } = require('../src/account/load');
const { StargateClient } = require('@cosmjs/stargate');
const { logger } = require('../src/utils/logger');
const config = require('../config');

/**
 * 运行质押示例
 */
async function runStaking() {
  try {
    logger.section('Running Staking Example');
    
    // 检查账户是否已创建
    const accountsPath = path.join(process.cwd(), 'accounts.json');
    
    if (!fs.existsSync(accountsPath)) {
      throw new Error('Accounts file not found. Run "npm run setup" first');
    }
    
    const accounts = JSON.parse(fs.readFileSync(accountsPath, 'utf8'));
    
    // 获取账户1
    const { wallet: wallet1, address: delegator } = await loadAccountFromFile('wallet1');
    
    // 查询委托人余额
    const client = await StargateClient.connect(config.network.rpcEndpoint);
    const balance = await client.getAllBalances(delegator);
    
    logger.info(`Delegator (${delegator}) balance: ${JSON.stringify(balance)}`);
    
    // 检查余额是否足够
    const hasTokens = balance.some(
      coin => coin.denom === config.network.denom && parseInt(coin.amount) > 10000
    );
    
    if (!hasTokens) {
      throw new Error(`Insufficient ${config.network.denom} tokens in account. Run "npm run get-tokens" first`);
    }
    
    // 获取活跃验证者列表
    logger.info('Fetching active validators...');
    const validators = await getValidators('BOND_STATUS_BONDED');
    
    if (validators.length === 0) {
      throw new Error('No active validators found on the network');
    }
    
    // 选择第一个验证者
    const selectedValidator = validators[0];
    logger.info(`Selected validator: ${selectedValidator.moniker} (${selectedValidator.operatorAddress})`);
    
    // 确定质押金额（总余额的5%）
    const coin = balance.find(c => c.denom === config.network.denom);
    const amount = Math.floor(parseInt(coin.amount) * 0.05).toString();
    
    logger.info(`Delegating ${amount} ${config.network.denom} to validator ${selectedValidator.operatorAddress}`);
    
    // 执行质押
    const result = await delegateTokens(
      accounts.wallet1.mnemonic,
      selectedValidator.operatorAddress,
      amount,
      config.network.denom
    );
    
    logger.success(`Staking successful!`);
    logger.info(`Transaction hash: ${result.transactionHash}`);
    
    // 查询委托信息
    logger.info('Querying delegation info...');
    const client2 = await StargateClient.connect(config.network.rpcEndpoint);
    const queryClient = client2.getQueryClient();
    const delegation = await queryClient.staking.delegation(
      delegator,
      selectedValidator.operatorAddress
    );
    
    if (delegation.delegationResponse) {
      logger.info(`Delegation amount: ${delegation.delegationResponse.balance.amount} ${delegation.delegationResponse.balance.denom}`);
    } else {
      logger.warn('No delegation info found. The transaction may still be processing.');
    }
    
    logger.success('Staking example completed successfully');
    logger.info('Next steps:');
    logger.info('1. Run "npm run mining" to explore mining functionality');
    
    return result;
  } catch (error) {
    logger.error(`Staking example failed: ${error.message}`);
    process.exit(1);
  }
}

// 直接运行脚本时执行
if (require.main === module) {
  runStaking();
}

module.exports = { runStaking };