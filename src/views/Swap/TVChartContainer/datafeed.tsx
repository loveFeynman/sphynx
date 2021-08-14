// eslint-disable-next-line import/extensions
import { makeApiRequest,generateSymbol,makeApiRequest1} from './helpers';

const lastBarsCache = new Map();
const configurationData = { 
    supported_resolutions: ['1D', '1W', '1M'],
    exchanges: [{
        value: 'Bitfinex',
        name: 'Bitfinex',
        desc: 'Bitfinex',
    }
    ],
};
async function getAllSymbols() {
    const data = await makeApiRequest('data/v3/all/exchanges');
    let allSymbols:any = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const exchange of configurationData.exchanges) {
        // eslint-disable-next-line prefer-destructuring
        const pairs = data.Data[exchange.value].pairs;
        // eslint-disable-next-line no-restricted-syntax
        for (const leftPairPart of Object.keys(pairs)) {
            const symbols = pairs[leftPairPart].map(rightPairPart => {
                const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart);
                return {
                    symbol: symbol.short,
                    full_name: symbol.full,
                    description: symbol.short,
                    exchange: exchange.value,
                    type: 'crypto',
                };
            });
            allSymbols = [...allSymbols, ...symbols];
        }
    }
    return allSymbols;
}
export default {
    onReady: (callback:any) => {
         // eslint-disable-next-line no-console
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
    },
    searchSymbols: async (
        userInput:any,
        exchange:any,
        symbolType:any,
        onResultReadyCallback:any,
    ) => {
         // eslint-disable-next-line no-console
        console.log('[searchSymbols]: Method call');
        const symbols = await getAllSymbols();
        const newSymbols = symbols.filter(symbol => {
            const isExchangeValid = exchange === '' || symbol.exchange === exchange;
            const isFullSymbolContainsInput = symbol.full_name
                .toLowerCase()
                .indexOf(userInput.toLowerCase()) !== -1;
            return isExchangeValid && isFullSymbolContainsInput;
        });
        onResultReadyCallback(newSymbols);
    },
    resolveSymbol: async (
        symbolName:any,
        onSymbolResolvedCallback:any,
        onResolveErrorCallback:any,
    ) => {
         // eslint-disable-next-line no-console
        console.log('[resolveSymbol]: Method call', symbolName);
        // const symbols = await getAllSymbols();
        // const symbolItem = symbols.find(({full_name,
        // }) => full_name === symbolName);
        // if (!symbolItem) {
        //     // console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
        //     onResolveErrorCallback('cannot resolve symbol');
        //     return;
        // }
        const symbolInfo = {
            ticker: "100x/BNB",
            name: "100x/BNB",
            description: "100x/BNB",
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            exchange: "Pancake v2",
            minmov: 1,
            pricescale: 100,
            has_intraday: false,
            has_no_volume: true,
            has_weekly_and_monthly: false,
            supported_resolutions: configurationData.supported_resolutions,
            volume_precision: 2,
            data_status: 'streaming',
        };
        // eslint-disable-next-line no-console
        console.log('[resolveSymbol]: Symbol resolved', symbolName);
        onSymbolResolvedCallback(symbolInfo);
    },
    getBars: async (symbolInfo:any, resolution:any, periodParams:any, onHistoryCallback:any, onErrorCallback:any) => {
        // eslint-disable-next-line no-console
        console.log('here In get bars')
        const { from, to, firstDataRequest } = periodParams;
        // console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
        // const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
        // const urlParameters = {
            //  e: parsedSymbol.exchange,
        //  fsym: parsedSymbol.fromSymbol,
        //  tsym: parsedSymbol.toSymbol,
        //  toTs: to,
        //  limit: 2000,
        // };
        
        const Get_data = `
        {
        ethereum(network: bsc) {
            dexTrades(
              options: {limit: 301, asc: "timeInterval.minute"}
              date: {since: "2021-05-03"}
              exchangeName: {in: ["Pancake", "Pancake v2"]}
              baseCurrency: {is: "0x016c285d5b918b92aa85ef1e147498badfe30d69"}
              quoteCurrency: {is: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"}
            ) {
                timeInterval {
                    minute(count: 3600)
                  }
                baseCurrency {
                    symbol
                    address
                }
                baseAmount
                quoteCurrency {
                    symbol
                  address
                }
                quoteAmount
                trades: count
                quotePrice
                maximum_price: quotePrice(calculate: maximum)
                minimum_price: quotePrice(calculate: minimum)
                median_price: quotePrice(calculate: median)
                open_price: minimum(of: block, get: quote_price)
                close_price: maximum(of: block, get: quote_price)
            }
          }
    }`
    try {
            const data = await makeApiRequest1(Get_data);
            if (!firstDataRequest) {
                // "noData" should be set if there is no data in the requested period.
                onHistoryCallback([], {
                    noData: true,
                });
                return;
            }
            let bars:any = [];
            // if(data.data.data){
                data.data.ethereum.dexTrades.map((bar:any,i:any) =>{
                    const obj = {
                        time: bar.timeInterval.minute,
                        low: (bar.minimum_price),
                        high: (bar.maximum_price),
                        open: (bar.open_price),
                        close: (bar.close_price),
                        isBarClosed : true,
                        isLastBar : false
                    }
                    if(i === data.data.ethereum.dexTrades.length -1 ){
                        obj.isLastBar = true
                        obj.isBarClosed = false
                    }
                    // console.log("here==",obj)
                    bars = [...bars, obj];
                    return {}
                })
            //   }\
                  console.log("here===========",bars)
                 // eslint-disable-next-line no-console
                
            // if (firstDataRequest) {
                lastBarsCache.set(symbolInfo.full_name, {
                    ...bars[bars.length - 1],
                });
            // }
            // console.log(`[getBars]: returned ${bars.length} bar(s)`);
            onHistoryCallback(bars, {
                noData: false,
            });
        } catch (error) {
            // console.log('[getBars]: Get error', error);
            onErrorCallback(error);
        }
    },
    // subscribeBars: (
    //     symbolInfo,
    //     resolution,
    //     onRealtimeCallback,
    //     subscribeUID,
    //     onResetCacheNeededCallback,
    // ) => {
    //     console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);
    //     subscribeOnStream(
    //      symbolInfo,
    //      resolution,
    //      onRealtimeCallback,
    //      subscribeUID,
    //      onResetCacheNeededCallback,
    //      lastBarsCache.get(symbolInfo.full_name),
    //     );
    // },
    // unsubscribeBars: (subscriberUID) => {
    //     console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    //     unsubscribeFromStream(subscriberUID);
    // },
};
export {}