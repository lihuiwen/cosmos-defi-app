const { StargateClient } = require('@cosmjs/stargate');
const config = require('../../config');
const { logger } = require('../utils/logger');

/**
 * 获取验证者列表
 * @param {string} status 验证者状态 (BOND_STATUS_BONDED, BOND_STATUS_UNBONDED, BOND_STATUS_UNBONDING)
 * @returns {Promise<Array>} 验证者列表
 */
async function getValidators(status = 'BOND_STATUS_BONDED') {
  logger.info(`Fetching validators with status: ${status}`);
  
  // 连接到RPC节点
  const client = await StargateClient.connect(config.network.rpcEndpoint);
  
  // 获取查询客户端
  const queryClient = client.getQueryClient();
  
  // 获取验证者列表
  const response = await queryClient.staking.validators(status);
  
  logger.info(`Found ${response.validators.length} validators`);
  
  return response.validators.map(validator => ({
    operatorAddress: validator.operatorAddress,
    moniker: validator.description?.moniker || 'Unknown',
    identity: validator.description?.identity || '',
    website: validator.description?.website || '',
    details: validator.description?.details || '',
    tokens: validator.tokens,
    commission: validator.commission?.commissionRates?.rate || '0',
    uptime: '100%', // 需要额外查询来获取精确的上线时间
    status: validator.status,
  }));
}

/**
 * 获取验证者详情
 * @param {string} validatorAddress 验证者地址
 * @returns {Promise<Object>} 验证者详情
 */
async function getValidatorInfo(validatorAddress) {
  logger.info(`Fetching validator info: ${validatorAddress}`);
  
  // 连接到RPC节点
  const client = await StargateClient.connect(config.network.rpcEndpoint);
  
  // 获取查询客户端
  const queryClient = client.getQueryClient();
  
  // 获取验证者信息
  try {
    const validator = await queryClient.staking.validator(validatorAddress);
    
    // 计算年化收益率 (APR) - 这是一个简化版，实际APR需要考虑更多因素
    const bondedTokens = await queryClient.staking.pool();
    const inflation = 0.13; // 这是一个估计值，实际应从参数模块查询
    const commissionRate = parseFloat(validator.validator.commission.commissionRates.rate);
    
    // 简化的APR计算
    const validatorTokens = parseFloat(validator.validator.tokens);
    const totalTokens = parseFloat(bondedTokens.pool.bondedTokens);
    const validatorShare = validatorTokens / totalTokens;
    
    const apr = (inflation / validatorShare) * (1 - commissionRate);
    
    return {
      ...validator.validator,
      estimatedAPR: `${(apr * 100).toFixed(2)}%`,
    };
  } catch (error) {
    logger.error(`Failed to get validator info: ${error.message}`);
    throw error;
  }
}

module.exports = { getValidators, getValidatorInfo };