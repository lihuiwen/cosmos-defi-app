module.exports = {
  // 默认值
  DEFAULT_FAUCET_URL: 'https://faucet.cosmos.network/',
  DEFAULT_FEE_AMOUNT: '5000',
  DEFAULT_GAS_LIMIT: '200000',
  
  // 交易相关
  TRANSACTION_MEMO_MAX_LENGTH: 256,
  
  // 单位换算
  MICRO_DENOM_MULTIPLIER: 1000000, // 1 ATOM = 1,000,000 uatom
  
  // 质押相关
  MIN_DELEGATION_AMOUNT: '1000', // 最小质押数量
  
  // 挖矿相关
  MIN_SELF_DELEGATION: '1000000', // 最小自我质押(创建验证者)
  
  // 网络状态
  BLOCK_TIME_MS: 6000, // 出块时间(毫秒)
  UNBONDING_TIME_DAYS: 21, // 解绑期(天)
};