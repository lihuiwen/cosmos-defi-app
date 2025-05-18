const fs = require('fs');
const path = require('path');
const { transferTokens } = require('../src/transactions/transfer');
const { loadAccountFromFile } = require('../src/account/load');
const { StargateClient } = require('@cosmjs/stargate');
const { logger } = require('../src/utils/logger');
const config = require('../config');

/**
 * 运行转账示例
 */
async function runTransfer() {
  try {
    logger.section('Running Transfer Example');
    
    // 检查账户是否已创建
    const accountsPath = path.join(process.cwd(), 'accounts.json');
    
    if (!fs.existsSync(accountsPath)) {
      throw new Error('Accounts file not found. Run "npm run setup" first');
    }
    
    const accounts = JSON.parse(fs.readFileSync(accountsPath, 'utf8'));
    
    // 确保有两个账户
    if (!accounts.wallet1 || !accounts.wallet2) {
      throw new Error('Two accounts are required for transfer. Run "npm run setup" again');
    }
    
    // 获取账户1的钱包
    const { wallet: wallet1, address: sender } = await loadAccountFromFile('wallet1');
    const recipient = accounts.wallet2.address;
    
    // 查询发送方余额
    const client = await StargateClient.connect(config.network.rpcEndpoint);
    const balance = await client.getAllBalances(sender);
    
    logger.info(`Sender (${sender}) balance: ${JSON.stringify(balance)}`);
    
    // 检查余额是否足够
    const hasTokens = balance.some(
      coin => coin.denom === config.network.denom && parseInt(coin.amount) > 0
    );
    
    if (!hasTokens) {
      throw new Error(`No ${config.network.denom} tokens in sender account. Run "npm run get-tokens" first`);
    }
    
    // 确定转账金额（转10%的余额）
    const coin = balance.find(c => c.denom === config.network.denom);
    const amount = Math.floor(parseInt(coin.amount) * 0.1).toString();
    
    logger.info(`Transferring ${amount} ${config.network.denom} from ${sender} to ${recipient}`);
    
    // 执行转账
    const result = await transferTokens(
      accounts.wallet1.mnemonic,
      recipient,
      amount,
      config.network.denom,
      'Test transfer via CosmJS'
    );
    
    logger.success(`Transfer successful!`);
    logger.info(`Transaction hash: ${result.transactionHash}`);
    
    // 验证接收方余额
    const recipientBalance = await client.getAllBalances(recipient);
    logger.info(`Recipient (${recipient}) balance: ${JSON.stringify(recipientBalance)}`);
    
    logger.success('Transfer example completed successfully');
    logger.info('Next steps:');
    logger.info('1. Run "npm run stake" to test staking functionality');
    logger.info('2. Run "npm run mining" to explore mining functionality');
    
    return result;
  } catch (error) {
    logger.error(`Transfer example failed: ${error.message}`);
    process.exit(1);
  }
}

// 直接运行脚本时执行
if (require.main === module) {
  runTransfer();
}

module.exports = { runTransfer };