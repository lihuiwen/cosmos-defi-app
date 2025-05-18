# Cosmos DeFi App

基于CosmJS开发的宇宙生态DeFi应用，包含转账交易、挖矿和质押功能。

## 功能特点

- **账户管理**: 创建钱包、加载账户、查询余额
- **转账交易**: 单笔转账、批量转账、交易历史查询
- **挖矿功能**: 验证者列表、挖矿奖励查询、创建验证者
- **质押功能**: 代币质押、解除质押、重新质押、领取质押奖励

## 快速开始

1. **安装依赖**

```bash
npm install
```

2. **配置环境变量**

```bash
cp .env.example .env
# 编辑.env文件，添加你的配置
```

3. **初始化项目**

```bash
npm run setup
```

4. **运行功能示例**

```bash
# 获取测试代币
npm run get-tokens

# 执行转账
npm run transfer

# 执行质押
npm run stake

# 探索挖矿功能
npm run mining

# 或者运行所有功能
npm run all
```

## 项目结构

```
cosmos-defi-app/
├── config/          # 配置文件
├── src/             # 源代码
│   ├── account/     # 账户管理
│   ├── transactions/# 交易相关
│   ├── mining/      # 挖矿功能
│   ├── staking/     # 质押功能
│   └── utils/       # 工具函数
└── scripts/         # 脚本文件
```

## 许可证

MIT