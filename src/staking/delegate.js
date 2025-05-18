const { SigningStargateClient } = require('@cosmjs/stargate');
const { loadWallet } = require('../account/load');
const config = require('../../config');
const { logger } = require('../utils/logger');

/**
 * 委托代币给验证者(质押)
 * @param {string} delegatorMnemonic 委托人助记词
 * @param {string} validatorAddress 验证者地址
 * @param {string} amount 质押金额
 * @param {string} denom 代币单位
 * @returns {Promise<object>} 交易结果
 */
async function delegateTokens(
  delegatorMnemonic,
  validatorAddress,
  amount,
  denom = config.network.denom
) {
  // 加载委托人钱包
  const wallet = await loadWallet(delegatorMnemonic);
  const [delegator] = await wallet.getAccounts();
  
  logger.info(`Delegating ${amount} ${denom} from ${delegator.address} to validator ${validatorAddress}`);
  
  // 创建签名客户端
  const client = await SigningStargateClient.connectWithSigner(
    config.network.rpcEndpoint,
    wallet
  );
  
  // 查询余额
  const balance = await client.getAllBalances(delegator.address);
  logger.info(`Delegator balance: ${JSON.stringify(balance)}`);
  
  // 检查余额是否足够
  const hasSufficientFunds = balance.some(
    coin => coin.denom === denom && parseInt(coin.amount) >= parseInt(amount)
  );
  
  if (!hasSufficientFunds) {
    throw new Error(`Insufficient balance of ${denom} for delegation`);
  }
  
  // 准备质押金额
  const stakeAmount = {
    denom,
    amount,
  };
  
  // 执行质押
  try {
    const result = await client.delegateTokens(
      delegator.address,
      validatorAddress,
      stakeAmount,
      config.fee,
      "Staking via CosmJS"
    );
    
    logger.info(`Delegation successful! Hash: ${result.transactionHash}`);
    
    // 查询委托信息
    const delegations = await client.getQueryClient().staking.delegation(
      delegator.address,
      validatorAddress
    );
    
    logger.info(`Delegation info: ${JSON.stringify(delegations.delegationResponse)}`);
    
    return result;
  } catch (error) {
    logger.error(`Delegation failed: ${error.message}`);
    throw error;
  }
}

module.exports = { delegateTokens };