module.exports = {
  // 主网配置
  mainnet: {
    rpcEndpoint: 'https://rpc.cosmos.network:443',
    restEndpoint: 'https://api.cosmos.network',
    chainId: 'cosmoshub-4',
    prefix: 'cosmos',
    denom: 'uatom',
    coinType: 118,
    gasPrice: '0.025',
  },
  
  // 测试网配置
  testnet: {
    rpcEndpoint: 'https://rpc.sentry-01.theta-testnet.polypore.xyz:443',
    restEndpoint: 'https://api.sentry-01.theta-testnet.polypore.xyz',
    chainId: 'theta-testnet-001',
    prefix: 'cosmos',
    denom: 'uatom',
    coinType: 118,
    gasPrice: '0.025',
    explorerUrl: 'https://explorer.theta-testnet.polypore.xyz',
  },
  
  // 本地网络配置
  local: {
    rpcEndpoint: 'http://localhost:26657',
    restEndpoint: 'http://localhost:1317',
    chainId: 'simapp',
    prefix: 'cosmos',
    denom: 'stake',
    coinType: 118,
    gasPrice: '0.025',
  },
};