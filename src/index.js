/**
 * 这是项目的主入口文件
 * 提供所有功能的访问点
 */

// 账户功能
const { createAccounts } = require('./account/create');
const { loadWallet, loadAccountFromFile } = require('./account/load');

// 交易功能
const { transferTokens } = require('./transactions/transfer');

// 挖矿功能
const { getValidators, getValidatorInfo } = require('./mining/validators');
const { createValidator } = require('./mining/create-validator');

// 质押功能
const { delegateTokens } = require('./staking/delegate');
const { claimRewards } = require('./staking/claim-rewards');

// 工具功能
const { logger } = require('./utils/logger');

// 配置
const config = require('../config');

// 导出所有功能
module.exports = {
  // 账户管理
  account: {
    create: createAccounts,
    load: loadWallet,
    loadFromFile: loadAccountFromFile,
  },
  
  // 交易
  transactions: {
    transfer: transferTokens,
  },
  
  // 挖矿
  mining: {
    getValidators,
    getValidatorInfo,
    createValidator,
  },
  
  // 质押
  staking: {
    delegate: delegateTokens,
    claimRewards,
  },
  
  // 工具
  utils: {
    logger,
  },
  
  // 配置
  config,
};