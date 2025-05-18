const { createAccounts } = require('../src/account/create');
const { logger } = require('../src/utils/logger');

async function setup() {
  try {
    logger.section('Setting up Cosmos DeFi Application');
    
    // 创建测试账户
    const accounts = await createAccounts(2);
    
    logger.success('Setup completed successfully!');
    logger.info('Next steps:');
    logger.info('1. Run "npm run get-tokens" to get test tokens');
    logger.info('2. Run "npm run transfer" to test token transfers');
    logger.info('3. Run "npm run stake" to test staking');
    logger.info('4. Run "npm run mining" to explore mining/validator features');
    
    return accounts;
  } catch (error) {
    logger.error(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// 直接运行脚本时执行setup
if (require.main === module) {
  setup();
}

module.exports = { setup };