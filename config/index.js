const dotenv = require('dotenv');
const networks = require('./networks');
const constants = require('./constants');

// 载入环境变量
dotenv.config();

// 确定要使用的网络
const networkType = process.env.NETWORK || 'testnet';
const networkConfig = networks[networkType];

if (!networkConfig) {
  throw new Error(`Network "${networkType}" not found in configuration`);
}

module.exports = {
  // 网络配置
  network: networkConfig,
  
  // 账户配置
  account: {
    mnemonic: process.env.MNEMONIC,
    keystorePath: process.env.KEYSTORE_PATH,
    keystorePassword: process.env.KEYSTORE_PASSWORD,
  },
  
  // 水龙头信息
  faucet: {
    url: process.env.FAUCET_URL || constants.DEFAULT_FAUCET_URL,
  },
  
  // 交易费用设置
  fee: {
    amount: [
      {
        denom: networkConfig.denom,
        amount: constants.DEFAULT_FEE_AMOUNT,
      },
    ],
    gas: constants.DEFAULT_GAS_LIMIT,
  },
  
  // 显示设置
  log: {
    level: process.env.LOG_LEVEL || 'info',
  },
};