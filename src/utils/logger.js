const chalk = require('chalk');

/**
 * 简单的日志记录工具
 * 使用chalk为不同级别的日志添加颜色
 */
const logger = {
  /**
   * 记录信息级别日志
   * @param {string} message 日志消息
   */
  info(message) {
    console.log(chalk.blue(`[INFO] ${message}`));
  },

  /**
   * 记录成功级别日志
   * @param {string} message 日志消息
   */
  success(message) {
    console.log(chalk.green(`[SUCCESS] ${message}`));
  },

  /**
   * 记录警告级别日志
   * @param {string} message 日志消息
   */
  warn(message) {
    console.log(chalk.yellow(`[WARNING] ${message}`));
  },

  /**
   * 记录错误级别日志
   * @param {string} message 日志消息
   */
  error(message) {
    console.log(chalk.red(`[ERROR] ${message}`));
  },

  /**
   * 记录调试级别日志
   * @param {string} message 日志消息
   */
  debug(message) {
    // 仅在调试模式下输出
    if (process.env.LOG_LEVEL === 'debug') {
      console.log(chalk.gray(`[DEBUG] ${message}`));
    }
  },

  /**
   * 记录交易相关日志
   * @param {string} message 日志消息
   */
  transaction(message) {
    console.log(chalk.cyan(`[TRANSACTION] ${message}`));
  },

  /**
   * 显示带有标题的日志区块
   * @param {string} title 区块标题
   */
  section(title) {
    console.log('\n' + chalk.magenta('='.repeat(50)));
    console.log(chalk.magenta.bold(` ${title.toUpperCase()} `));
    console.log(chalk.magenta('='.repeat(50)) + '\n');
  }
};

module.exports = { logger };