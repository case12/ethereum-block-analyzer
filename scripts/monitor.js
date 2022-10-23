const hre = require("hardhat");
const moment = require("moment");
const _ = require("lodash");
const { ADDRESS_LIST } = require("../constants/addresses");
const { forEach } = require("lodash");
const { Colors } = require("../constants/ansi_escape_codes");

function createAddressToCountMap(transactions) {
  return _.reduce(
    transactions,
    (result, transaction) => {
      const resultEntry = result[transaction.to];
      if (!resultEntry) {
        result[transaction.to] = { address: transaction.to, count: 1 };
      } else {
        resultEntry.count++;
      }

      return result;
    },
    {}
  );
}

function insertKnownAddressNames(transactionsMap) {
  ADDRESS_LIST.forEach((address) => {
    if (transactionsMap[address.address]) {
      _.set(transactionsMap, `${address.address}.name`, address.name);
    }
  });
}

function sortByCount(transactions) {
  return _.sortBy(transactions, "count").reverse();
}

function getSortedTransactionsByCount(transactions) {
  const transactionsMap = createAddressToCountMap(transactions);

  insertKnownAddressNames(transactionsMap);

  const finalTransactionsList = _.values(transactionsMap);

  return sortByCount(finalTransactionsList);
}

function printBlockInfo(block) {
  console.log("\n\n***************************");
  console.log(`Block Number: ${block.number}`);
  console.log(`Block Hash: ${block.hash}`);
  console.log(`Time: ${moment(block.timestamp * 1000).format("LL LTS")}`);
  console.log(`Number of transactions: ${block.transactions.length}`);
}

function getTransactionNameOutput(transaction) {
  if (transaction.name) return transaction.name;

  return (
    "\033]8;;" +
    `https://etherscan.io/address/${transaction.address}` +
    "\007" +
    transaction.address +
    "\033]8;;\007"
  );
}

function printTopInteractedAddresses(block, count) {
  const transactions = getSortedTransactionsByCount(block.transactions);

  console.log("\nTop 10 addresses interacted with last block\n");

  forEach(transactions.slice(0, count), (transaction, index) => {
    console.log(
      `${index + 1}: ${Colors.Brown_Orange}` +
        getTransactionNameOutput(transaction) +
        ` ${Colors.No_Color} - ${Colors.Green}${transaction.count}${Colors.No_Color}`
    );
  });
}

// '\e]8;;http://example.com\aThis is a link\e]8;;\a'

async function main() {
  const provider = new hre.ethers.providers.AlchemyProvider(
    "homestead",
    process.env.ALCHEMY_API_KEY
  );

  provider.on("block", async (blockNumber) => {
    const block = await provider.getBlockWithTransactions(blockNumber);

    printBlockInfo(block);
    printTopInteractedAddresses(block, 10);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
