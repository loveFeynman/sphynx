/* eslint-disable */
import * as React from 'react'
import styled from 'styled-components'
import TransactionNav from 'components/TransactionNav'
import './index.css'
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  IChartingLibraryWidget,
  ResolutionString,
} from '../../../charting_library'
import axios from 'axios'
import { makeApiRequest, generateSymbol, makeApiRequest1 } from './helpers'
import { useSelector } from 'react-redux'
import { ReactComponent as UpDownArrow } from 'assets/svg/icon/UpDownArrow.svg'
import { AppDispatch, AppState } from '../../../state'
import { isAddress } from '../../../utils'

const UpDownArrowBox = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  margin-top: 8px;
`

const ArrowWrapper = styled.div`
  margin: auto;
  width: 0;
  cursor: row-resize;
  & svg {
    width: 14px;
    height: 16px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 4px;
  }
`

const TransactionNavWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px 0 0;
  ${({ theme }) => theme.mediaQueries.md} {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
  }
`

const ChartContainer = styled.div<{ height: number }> `
  position: relative;
  height: ${(props) => props.height}px;
`

// eslint-disable-next-line import/extensions

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol']
  interval: ChartingLibraryWidgetOptions['interval']
  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string
  libraryPath: ChartingLibraryWidgetOptions['library_path']
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
  clientId: ChartingLibraryWidgetOptions['client_id']
  userId: ChartingLibraryWidgetOptions['user_id']
  fullscreen: ChartingLibraryWidgetOptions['fullscreen']
  autosize: ChartingLibraryWidgetOptions['autosize']
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides']
  containerId: ChartingLibraryWidgetOptions['container_id']
}

const ChartContainerProps = {
  symbol: 'AAPL',
  interval: 'D' as ResolutionString,
  containerId: 'tv_chart_container',
  datafeedUrl: 'https://demo_feed.tradingview.com',
  libraryPath: '/charting_library/',
  chartsStorageUrl: 'https://saveload.tradingview.com',
  chartsStorageApiVersion: '1.1',
  clientId: 'tradingview.com',
  userId: 'public_user_id',
  fullscreen: false,
  autosize: true,
  studiesOverrides: {},
}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)')
  const results = regex.exec(location.search)
  return results === null ? null : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode)
}

export const TVChartContainer: React.FC<Partial<ChartContainerProps>> = () => {
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)
  const result = isAddress(input)
  const draggableArrow = React.useRef<any>(null)
  const [ chartHeight, setChartHeight ] = React.useState(600)
  const [ dragPos, setDragPos ] = React.useState(0)

  const [tokendetails, setTokenDetails] = React.useState({
    name: 'PancakeSwap Token',
    pair: 'Cake/BNB',
    sybmol: 'CAKE',
    version: 'Pancake ' + routerVersion,
  })

  // const lastBarsCache = new Map()

  const configurationData = {
    supported_resolutions: ['1', '5', '10', '15', '30', '1H', '1D', '1W', '1M'],
    exchanges: [
      {
        value: 'Bitfinex',
        name: 'Bitfinex',
        desc: 'Bitfinex',
      },
      // Bitfinex
    ],
  }
  async function getAllSymbols() {
    // const data = await makeApiRequest(input);
    // debugger;
    let allSymbols: any = []

    // // eslint-disable-next-line no-restricted-syntax
    // for (const exchange of configurationData.exchanges) {
    //     // eslint-disable-next-line prefer-destructuring
    //     const pairs = data.Data[exchange.value].pairs;
    //     // eslint-disable-next-line no-restricted-syntax
    //     for (const leftPairPart of Object.keys(pairs)) {
    //         const symbols = pairs[leftPairPart].map(rightPairPart => {
    //             const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart);
    //             return {
    //                 symbol: symbol.short,
    //                 full_name: symbol.full,
    //                 description: symbol.short,
    //                 exchange: exchange.value,
    //                 type: 'crypto',
    //             };
    //         });
    //         allSymbols = [...allSymbols, ...symbols];
    //     }
    // }
    return allSymbols
  }
  const feed = {
    onReady: (callback: any) => {
      // console.log('[onReady]: Method call');
      setTimeout(() => callback(configurationData), 0)
    },
    searchSymbols: async (userInput: any, exchange: any, symbolType: any, onResultReadyCallback: any) => {
      // console.log('[searchSymbols]: Method call');
      const symbols = await getAllSymbols()
      const newSymbols = symbols.filter((symbol) => {
        const isExchangeValid = exchange === '' || symbol.exchange === exchange
        const isFullSymbolContainsInput = symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1
        return isExchangeValid && isFullSymbolContainsInput
      })
      onResultReadyCallback(newSymbols)
    },
    resolveSymbol: async (symbolName: any, onSymbolResolvedCallback: any, onResolveErrorCallback: any) => {
      // console.log('[resolveSymbol]: Method call', symbolName);
      // const symbols = await getAllSymbols();
      // const symbolItem = symbols.find(({full_name,
      // }) => full_name === symbolName);
      // if (!symbolItem) {
      //     // console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
      //     onResolveErrorCallback('cannot resolve symbol');
      //     return;
      // }
      const response = await axios.get(`https://thesphynx.co/api/tokenDetails/${input}`)
      setTokenDetails(response.data)

      const version =
        response.data.version.indexOf(' ') > 0
          ? response.data.version.split(' ')[0] + ' ' + routerVersion
          : response.data.version

      const symbolInfo = {
        ticker: response.data.pair,
        name: response.data.pair,
        description: response.data.sybmol,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: version,
        minmov: 1,
        pricescale: 100,
        has_intraday: true,
        has_no_volume: false,
        has_weekly_and_monthly: false,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 2,
        data_status: 'streaming',
      }
      // eslint-disable-next-line no-console
      // console.log('[resolveSymbol]: Symbol resolved', symbolName);
      onSymbolResolvedCallback(symbolInfo)
    },
    getBars: async (
      symbolInfo: any,
      resolution: any,
      periodParams: any,
      onHistoryCallback: any,
      onErrorCallback: any,
    ) => {
      // eslint-disable-next-line no-console
      // console.log('here In get bars')
      const { from, to, firstDataRequest } = periodParams
      // console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
      // const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
      // const urlParameters = {
      //  e: parsedSymbol.exchange,
      //  fsym: parsedSymbol.fromSymbol,
      //  tsym: parsedSymbol.toSymbol,
      //  toTs: to,
      //  limit: 2000,
      // };

      try {
        const data = await makeApiRequest1(input, routerVersion, resolution)
        if (result) {
          // setLoader(true);
          if (!firstDataRequest) {
            // "noData" should be set if there is no data in the requested period.
            onHistoryCallback([], {
              noData: true,
            })
            return
          }
        }

        let bars: any = []
        // if(data.data.data){
        data.map((bar: any, i: any) => {
          const obj = {
            time: new Date(bar.time).getTime(),
            low: bar.low * bar.baseLow,
            high: bar.high * bar.baseHigh,
            open: bar.open * bar.baseOpen,
            close: bar.close * bar.baseClose,
            isBarClosed: true,
            isLastBar: false,
          }
          if (i === data.length - 1) {
            obj.isLastBar = true
            obj.isBarClosed = false
          }
          bars = [...bars, obj]
          return {}
        })
        //   }
        // eslint-disable-next-line no-console

        // if (firstDataRequest) {
        // lastBarsCache.set(symbolInfo.full_name, {
        //   ...bars[bars.length - 1],
        // })
        // setLoader(false);
        // }
        onHistoryCallback(bars, {
          noData: false,
        })
      } catch (error) {
        // console.log('[getBars]: Get error', error.message);
        onErrorCallback(error)
      }
    },
  }
  // const tvWidget = null;
  //   React.useEffect(()=>{
  const getWidget = async () => {
    let tvWidget: IChartingLibraryWidget | null = null
    const widgetOptions: ChartingLibraryWidgetOptions = {
      // symbol: this.props.symbol as string,
      symbol: tokendetails.pair,
      // BEWARE: no trailing slash is expected in feed URL
      // tslint:disable-next-line:no-any
      //   datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(props.datafeedUrl),
      datafeed: feed,
      interval: ChartContainerProps.interval as ChartingLibraryWidgetOptions['interval'],
      container_id: ChartContainerProps.containerId as ChartingLibraryWidgetOptions['container_id'],
      library_path: ChartContainerProps.libraryPath as string,
      container: 'tv_chart_container',
      locale: getLanguageFromURL() || 'en',
      theme: 'Dark',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: ChartContainerProps.chartsStorageUrl,
      //   charts_storage_api_version: ChartContainerProps.chartsStorageApiVersion,
      client_id: ChartContainerProps.clientId,
      user_id: ChartContainerProps.userId,
      fullscreen: ChartContainerProps.fullscreen,
      autosize: ChartContainerProps.autosize,
      studies_overrides: ChartContainerProps.studiesOverrides,
    }

    tvWidget = await new widget(widgetOptions)
    // this.tvWidget = widget

    //  tvWidget.onChartReady(() => {
    //   tvWidget.headerReady().then(() => {
    //     const button = tvWidget.createButton();
    //     button.setAttribute('title', 'Click to show a notification popup');
    //     button.classList.add('apply-common-tooltip');
    //     button.addEventListener('click', () => tvWidget.showNoticeDialog({
    //         title: 'Notification',
    //         body: 'TradingView Charting Library API works correctly',
    //         callback: () => {
    //           console.log('Noticed!');
    //         },
    //       }));
    //     button.innerHTML = 'Check API';
    //   });
    // });
  }

  //   const tvWidget: IChartingLibraryWidget | null = null;
  // const getnewWidget=()=>{
  //         if (tvWidget !== null) {
  //       tvWidget.remove();
  //       tvWidget = null;
  //     }
  // }
  //   React.useEffect(()=>{
  //     if (tvWidget !== null) {
  //       tvWidget.remove();
  //       tvWidget = null;
  //     }
  //   },[tvWidget])

  React.useEffect(() => {
    getWidget()
  }, [input])

  const handleDragStart = (e) => {
    setDragPos(e.pageY)
  }

  const handleDrag = (e) => {
    if (chartHeight + e.pageY - dragPos > 600) {
      setChartHeight(chartHeight + e.pageY - dragPos)
    } else {
      setChartHeight(600)
    }
  }

  return (
    <div className={'TVChartContainer'}>
      {/* {loader ?
          <div style={{ position: 'absolute', left: 567, top: 150 }}>
            <BoxesLoader
              boxColor="#8b2a9b"
              shadowColor="#aa8929"
              style={{ marginBottom: "20px", }}
              desktopSize="100px"
              mobileSize="50px"
            />
          </div>
          : ""
        } */}
      <ChartContainer height={chartHeight}>
        <div id={ChartContainerProps.containerId} style={{ height: '100%', paddingBottom: '10px' }} />
      </ChartContainer>
      {/* <div style={{ height: '10px' }}>&nbsp;</div> */}
      <UpDownArrowBox>
        <ArrowWrapper ref={draggableArrow} draggable='true' onDragStart={e => handleDragStart(e)} onDragOver={e => handleDrag(e)}>
          <UpDownArrow />
        </ArrowWrapper>
        <TransactionNavWrapper>
          <TransactionNav />
        </TransactionNavWrapper>
      </UpDownArrowBox>
    </div>
  )
}