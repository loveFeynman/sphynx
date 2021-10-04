import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import axios from 'axios'
import cheerio from 'cheerio';
import abi from '../config/abi/erc20ABI.json'
import factoryAbi from '../config/abi/factoryAbi.json'
import { getVersion } from './getVersion'
import { BITQUERY_API_KEY } from '../config/constants/endpoints'

const httpProvider = new Web3.providers.HttpProvider(
  "https://old-thrumming-voice.bsc.quiknode.pro/7674ba364cc71989fb1398e1e53db54e4fe0e9e0/"
);
const web3 = new Web3(httpProvider);

const config = {
  headers: {
    "X-API-KEY": BITQUERY_API_KEY,
  },
};


async function getTokenDetails(address: string): Promise<{
  name: string,
  symbol: string,
  pair: string,
  version: string
}> {
  if (!address) {
    return null;
  }
  const token = new web3.eth.Contract(abi as AbiItem[], address);
  const name = await token.methods.name().call();
  const symbol = await token.methods.symbol().call();
  const version = await getVersion(address);
  return { name, symbol, pair: `${symbol }/BNB`, version: version.version }
}

async function getTokenStats(address: string) {
  const url = `https://bscscan.com/token/${address}`;
  const trxUrl = `https://bscscan.com/address/${address}`;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  let holders = $(".mr-3").text();
  holders = holders.replace(/\D/g, "");
  const marketCap = await getMarketCap(address);

  const response1 = await axios.get(trxUrl);
  const $1 = cheerio.load(response1.data);
  let txs = $1(".d-md-flex").text();
  txs = txs.split(" transactions")[0].split("total of ")[1];

  const contract = new web3.eth.Contract(abi as AbiItem[], address);
  let totalSupply = await contract.methods.totalSupply().call();
  const decimals = await contract.methods.decimals().call();
  const symbol = await contract.methods.symbol().call();
  const name = await contract.methods.name().call();

  totalSupply /= 10 ** decimals;

  return {
    holders,
    marketCap: `${marketCap}`,
    totalSupply,
    txs,
    decimals,
    symbol: `${name} (${symbol})`,
  }

}

async function getChartStats(address: string) {
  try {
    if (!address) {
      return {
        error: true,
        message: 'Invalid address!'
      };
    }
    const till = new Date().toISOString();
    const since = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();

    const baseAddress = address;
    const quoteAddress =
      baseAddress === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
        ? "0xe9e7cea3dedca5984780bafc599bd69add087d56"
        : "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
    let query = `{
              ethereum(network: bsc) {
                dexTrades(
                  date: {since: "${since}", till: "${till}"}
                  baseCurrency: {is: "${baseAddress}"}
                  quoteCurrency: {is: "${quoteAddress}"}
                  exchangeName: {in: ["Pancake v2"]}
                ) {
                  baseCurrency {
                    symbol
                  }
                  quoteCurrency {
                    symbol
                  }
                  open_price: minimum(of: block, get: quote_price)
                  close_price: maximum(of: block, get: quote_price)
                  tradeAmount(in: USD, calculate: sum)
                }
              }
            }
            `;
    const url = `https://graphql.bitquery.io/`;
    const {
      data: {
        data: {
          ethereum: { dexTrades },
        },
      },
    } = await axios.post(url, { query }, config);

    if (!dexTrades) {
      return {
        error: true,
        message: 'Invalid dexTrades!'
      };
    }

    const factory = new web3.eth.Contract(
      factoryAbi as AbiItem[],
      "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
    );
    const pairAddress = await factory.methods
      .getPair(baseAddress, quoteAddress)
      .call();

    const baseContract = new web3.eth.Contract(abi as AbiItem[], baseAddress);
    const quoteContract = new web3.eth.Contract(abi as AbiItem[], quoteAddress);

    let baseBalance = await baseContract.methods.balanceOf(pairAddress).call();
    const baseDecimals = await baseContract.methods.decimals().call();

    let quoteBalance = await quoteContract.methods
      .balanceOf(pairAddress)
      .call();
    const quoteDecimals = await quoteContract.methods.decimals().call();

    baseBalance /= 10 ** baseDecimals;
    quoteBalance /= 10 ** quoteDecimals;

    let price;
    let liquidityV2;
    let liquidityV2BNB;
    if (baseAddress !== "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c") {
      query = `{
                ethereum(network: bsc) {
                  dexTrades(
                    date: {since: "${since}", till: "${till}"}
                    baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
                    quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}
                    exchangeName: {in: ["Pancake v2"]}
                  ) {
                    baseCurrency {
                      symbol
                    }
                    quoteCurrency {
                      symbol
                    }
                    close_price: maximum(of: block, get: quote_price)
                  }
                }
              }
            `;
      const {
        data: {
          data: {
            ethereum: { dexTrades: newDexTrades },
          },
        },
      } = await axios.post(url, { query }, config);
      if (!newDexTrades) {
        return {
          error: true,
          message: 'No data found of this address'
        }
      }
      price =
        parseFloat(dexTrades[0].close_price) *
        parseFloat(newDexTrades[0].close_price);
      liquidityV2 = quoteBalance * parseFloat(newDexTrades[0].close_price);
      liquidityV2BNB = quoteBalance;
      if (price.toString().includes("e")) {
        price = price.toFixed(12);
      }
    } else {
      price = dexTrades[0].close_price;
      liquidityV2 = baseBalance * price;
      liquidityV2BNB = baseBalance;
    }
    const percDiff =
      100 *
      Math.abs(
        (parseFloat(dexTrades[0].open_price) -
          parseFloat(dexTrades[0].close_price)) /
        ((parseFloat(dexTrades[0].open_price) +
          parseFloat(dexTrades[0].close_price)) /
          2)
      );
    const sign = dexTrades[0].open_price > dexTrades[0].close_price ? "-" : "+";

    return {
      volume: dexTrades[0].tradeAmount,
      change: sign + percDiff,
      price,
      liquidityV2,
      liquidityV2BNB,
    };
  } catch (error) {
    return {
      volume: '',
      change: '',
      price: '',
      liquidityV2: '',
      liquidityV2BNB: '',
    }
    console.log(error);
  }
}

const getPrice = async (tokenAddr) => {
  try {
    if (tokenAddr === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") {
      const query = `{
        ethereum(network: bsc) {
          dexTrades(
            baseCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}
            quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
            options: {desc: ["block.height"], limit: 1}
          ) {
            block {
              height
            }
            baseCurrency {
              symbol
            }
            quoteCurrency {
              symbol
            }
            quotePrice
          }
        }
      }`;

      const url = `https://graphql.bitquery.io/`;
      const response = await axios.post(url, { query }, config);
      const {dexTrades} = response.data.data.ethereum;

      return (1 / dexTrades[0].quotePrice).toFixed(4);
    }
    const query = `{
      ethereum(network: bsc) {
        dexTrades(
          options: {limit: 1, desc: "block.height"}
          exchangeName: {in: ["Pancake", "Pancake v2"]}
          baseCurrency: {is: "${tokenAddr}"}
          quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
        ) {
          block {
            height
            timestamp{
              time
            }
          }
        }
      }
    }`;

    const url = `https://graphql.bitquery.io/`;
    const {
      data: {
        data: {
          ethereum: { dexTrades },
        },
      },
    } = await axios.post(url, { query }, config);

    if (dexTrades.length === 0) {
      return 0;
    }
    // if (
    //   (new Date().getTime() -
    //     new Date(dexTrades[0].block.timestamp.time).getTime()) >
    //   86400
    // ) {
    //   console.log("2222222");
    //   return 0;
    // }

    const erc20ABI = [
      {
        inputs: [],
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
    const tokenInstance = new web3.eth.Contract(erc20ABI as AbiItem[], tokenAddr);
    const tokenDecimals = await tokenInstance.methods.decimals().call();
    const data = await getPriceInfo(tokenAddr, tokenDecimals);
    // @ts-ignore
    return parseFloat(web3.utils.fromWei(data[data.length - 1]));
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};

const getPancakePairAddress = async (quoteToken, baseToken) => {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const PANCAKE_FACTORY_ADDRESS = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
  const pancakeFactoryContract = new web3.eth.Contract(
    factoryAbi as AbiItem[],
    PANCAKE_FACTORY_ADDRESS
  );
  const pairAddress = await pancakeFactoryContract.methods
    .getPair(quoteToken, baseToken)
    .call();
  if (pairAddress === ZERO_ADDRESS) {
    return null;
  }
  return pairAddress;
};

const getPriceInfo = async (input, decimals) => {
  const pancakeV2 = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  const busdAddr = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
  const wBNBAddr = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
  const routerABI = [
    {
      inputs: [
        { internalType: "uint256", name: "amountIn", type: "uint256" },
        { internalType: "address[]", name: "path", type: "address[]" },
      ],
      name: "getAmountsOut",
      outputs: [
        { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const routerInstance = new web3.eth.Contract(routerABI as AbiItem[], pancakeV2);
    let path = [input, busdAddr];
    const pairAddress = await getPancakePairAddress(input, busdAddr);
    if (pairAddress === null) {
      path = [input, wBNBAddr, busdAddr];
      routerInstance.methods
        .getAmountsOut(web3.utils.toBN(10 ** decimals), path)
        .call()
        .then((data) => resolve(data));
    } else {
      routerInstance.methods
        .getAmountsOut(web3.utils.toBN(10 ** decimals), path)
        .call()
        .then((data) => resolve(data));
    }
  });
};

const getMarketCap = async (address) => {
  try {
    if (!address) {
      return 0;
    }
    const query = `
    {
      ethereum(network: bsc) {
        dexTrades(
          baseCurrency: {is: "${address}"}
          quoteCurrency: {in: ["0xe9e7cea3dedca5984780bafc599bd69add087d56", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"]}
          exchangeName: {in: ["Pancake v2"]}
        ) {
          quoteCurrency {
            symbol
          }
          baseCurrency {
            symbol
          }
          baseAmount(calculate: sum)
        }
      }
    }
    
    `;
    const {
      data: {
        data: {
          ethereum: { dexTrades },
        },
      },
    } = await axios.post(`https://graphql.bitquery.io/`, { query }, config);

    const price = await getPrice(address);
    return dexTrades[0] ? dexTrades[0].baseAmount * +price : 0;
  } catch (error) {
    return 0;
  }
};

export {
  getTokenDetails,
  getTokenStats,
  getChartStats
}
