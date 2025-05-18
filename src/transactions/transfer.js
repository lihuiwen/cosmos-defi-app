const { SigningStargateClient } = require('@cosmjs/stargate');
const { loadWallet } = require('../account/load');
const config = require('../../config');
const { logger } = require('../utils/logger');

/**
 * 转账代币
 * @param {string} senderMnemonic 发送方助记词
 * @param {string} recipientAddress 接收方地址
 * @param {string} amount 金额
 * @param {string} denom 代币单位
 * @param {string} memo 交易备注
 * @returns {Promise<object>} 交易结果
 */
async function transferTokens(
  senderMnemonic,
  recipientAddress,
  amount,
  denom = config.network.denom,
  memo = 'Transfer via CosmJS'
) {
  // 加载发送方钱包
  const wallet = await loadWallet(senderMnemonic);
  const [sender] = await wallet.getAccounts();
  
  logger.info(`Initiating transfer from ${sender.address} to ${recipientAddress}`);
  
  // 创建签名客户端
  const client = await SigningStargateClient.connectWithSigner(
    config.network.rpcEndpoint,
    wallet
  );
  
  // 查询余额
  const balance = await client.getAllBalances(sender.address);
  logger.info(`Sender balance: ${JSON.stringify(balance)}`);
  
  // 准备金额
  const transferAmount = {
    denom,
    amount,
  };
  
  // 执行转账
  try {
    const result = await client.sendTokens(
      sender.address,
      recipientAddress,
      [transferAmount],
      config.fee,
      memo
    );
    
    logger.info(`Transfer successful! Hash: ${result.transactionHash}`);
    
    // 验证转账结果
    const newBalance = await client.getAllBalances(sender.address);
    logger.info(`New sender balance: ${JSON.stringify(newBalance)}`);
    
    return result;
  } catch (error) {
    logger.error(`Transfer failed: ${error.message}`);
    throw error;
  }
}

module.exports = { transferTokens };