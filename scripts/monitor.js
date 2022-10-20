const hre = require("hardhat");
const moment = require("moment");
const _ = require("lodash");
const { ADDRESS_LIST } = require("../constants/addresses");

const provider = hre.ethers.getDefaultProvider();

async function main() {
  provider.on("block", async (blockNumber) => {
    const block = await provider.getBlockWithTransactions(blockNumber);

    console.log("\n\n***************************");
    console.log(`Block Number: ${block.number}`);
    console.log(`Block Hash: ${block.hash}`);
    console.log(`Time: ${moment(block.timestamp * 1000).format("LL LTS")}`);
    console.log(`Number of transactions: ${block.transactions.length}`);

    const initialTransactionMap = _.reduce(
      ADDRESS_LIST,
      (acc, address) => {
        return {
          ...acc,
          [address.address]: { name: address.name, count: 0 },
        };
      },
      {}
    );

    const transactionsMap = _.reduce(
      block.transactions,
      (result, transaction) => ({
        ...result,
        [transaction.to]: result[transaction.to]
          ? {
              ...result[transaction.to],
              address: transaction.to,
              count: result[transaction.to].count + 1,
            }
          : { address: transaction.to, count: 1 },
      }),
      initialTransactionMap
    );

    const sortedTransactions = _.sortBy(
      _.values(transactionsMap),
      "count"
    ).reverse();

    console.log("Top 10 addresses interacted with last block");
    console.log(sortedTransactions.slice(0, 10));
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
