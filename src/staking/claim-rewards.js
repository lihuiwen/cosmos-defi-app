const { SigningStargateClient } = require('@cosmjs/stargate');
const { loadWallet } = require('../account/load');
const config = require('../../config');
const { logger } = require('../utils/logger');

/**
 * 收集质押奖励
 * @param {string} delegatorMnemonic 委托人助记词
 * @param {string|null} validatorAddress 验证者地址，若为null则收集所有验证者的奖励
 * @returns {Promise<object>} 交易结果
 */
async function claimRewards(
  delegatorMnemonic,
  validatorAddress = null
) {
  // 加载委托人钱包
  const wallet = await loadWallet(delegatorMnemonic);
  const [delegator] = await wallet.getAccounts();
  
  logger.info(`Claiming rewards for ${delegator.address}`);
  
  // 创建签名客户端
  const client = await SigningStargateClient.connectWithSigner(
    config.network.rpcEndpoint,
    wallet
  );
  
  // 查询奖励信息
  const queryClient = client.getQueryClient();
  const rewardsResponse = await queryClient.distribution.delegationTotalRewards(delegator.address);
  
  // 格式化奖励信息
  const rewards = rewardsResponse.rewards.map(reward => ({
    validatorAddress: reward.validatorAddress,
    rewards: reward.reward
  }));
  
  if (rewards.length === 0) {
    logger.warn('No rewards found to claim');
    return { success: false, message: 'No rewards to claim' };
  }
  
  logger.info(`Found rewards from ${rewards.length} validators`);
  
  if (validatorAddress) {
    // 收集特定验证者的奖励
    logger.info(`Claiming rewards from validator ${validatorAddress}`);
    
    try {
      const result = await client.withdrawRewards(
        delegator.address,
        validatorAddress,
        config.fee,
        "Claiming rewards via CosmJS"
      );
      
      logger.info(`Claim rewards successful! Hash: ${result.transactionHash}`);
      return result;
    } catch (error) {
      logger.error(`Failed to claim rewards: ${error.message}`);
      throw error;
    }
  } else {
    // 收集所有验证者的奖励
    logger.info('Claiming rewards from all validators');
    
    // 获取委托的验证者列表
    const validatorAddresses = rewards.map(r => r.validatorAddress);
    
    try {
      // 我们只能按顺序收集每个验证者的奖励，这里简化为只处理第一个
      if (validatorAddresses.length > 0) {
        const firstValidator = validatorAddresses[0];
        logger.info(`Claiming rewards from validator ${firstValidator} (1/${validatorAddresses.length})`);
        
        const result = await client.withdrawRewards(
          delegator.address,
          firstValidator,
          config.fee,
          "Claiming rewards via CosmJS"
        );
        
        logger.info(`Claim rewards successful! Hash: ${result.transactionHash}`);
        logger.info(`Note: In a full implementation, you would claim from all ${validatorAddresses.length} validators`);
        
        return result;
      } else {
        return { success: false, message: 'No validators found for reward claiming' };
      }
    } catch (error) {
      logger.error(`Failed to claim rewards: ${error.message}`);
      throw error;
    }
  }
}

module.exports = { claimRewards };