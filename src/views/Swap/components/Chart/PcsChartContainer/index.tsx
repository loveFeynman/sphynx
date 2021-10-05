/* eslint-disable */
import * as React from 'react'
import styled from 'styled-components'
import './index.css'
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  widget,
} from 'charting_library/charting_library'
import { makeApiRequest1 } from './helpers'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { isAddress } from 'utils'
import { getTokenDetails } from '../../../../../utils/apiServices'
import { UNSET_PRICE } from 'config/constants/info'

const ChartContainer = styled.div<{ height: number }>`
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
  container: ChartingLibraryWidgetOptions['container']
  height: number
}

const ChartContainerProps = {
  symbol: 'AAPL',
  interval: '15' as ResolutionString,
  container: 'tv_chart_container',
  datafeedUrl: 'https://demo_feed.tradingview.com',
  libraryPath: '/charting_library/',
  chartsStorageUrl: 'https://saveload.tradingview.com',
  chartsStorageApiVersion: '1.1',
  clientId: 'tradingview.com',
  userId: 'public_user_id',
  fullscreen: false,
  autosize: true,
  studiesOverrides: {},
  height: 600,
}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)')
  const results = regex.exec(location.search)
  return results === null ? null : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode)
}

let myInterval: any
let currentResolutions: any

const PcsChartContainer: React.FC<Partial<ChartContainerProps>> = (props) => {
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const realPrice = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.price)
  const realAmount = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.amount)
  const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)
  const result = isAddress(input)
  const priceRef = React.useRef(UNSET_PRICE);
  const amountRef = React.useRef(0);

  const [tokendetails, setTokenDetails] = React.useState({
    name: 'PancakeSwap Token',
    pair: 'Cake/BNB',
    symbol: 'CAKE',
    version: 'Pancake ' + routerVersion,
  })

  let lastBarsCache: any

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
    let allSymbols: any = []
    return allSymbols
  }

  const feed = {
    onReady: (callback: any) => {
      setTimeout(() => callback(configurationData), 0)
    },
    searchSymbols: async (userInput: any, exchange: any, symbolType: any, onResultReadyCallback: any) => {
      const symbols = await getAllSymbols()
      const newSymbols = symbols.filter((symbol) => {
        const isExchangeValid = exchange === '' || symbol.exchange === exchange
        const isFullSymbolContainsInput = symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1
        return isExchangeValid && isFullSymbolContainsInput
      })
      onResultReadyCallback(newSymbols)
    },
    resolveSymbol: async (symbolName: any, onSymbolResolvedCallback: any, onResolveErrorCallback: any) => {
      const res = await getTokenDetails(input)
      setTokenDetails(res)

      const version =
        res.version.indexOf(' ') > 0
          ? res.version.split(' ')[0] + ' ' + routerVersion
          : res.version

      const symbolInfo = {
        ticker: res.pair,
        name: res.pair,
        description: res.symbol,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: version,
        minmov: 1,
        pricescale: 1000000,
        has_intraday: true,
        has_no_volume: false,
        has_weekly_and_monthly: false,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 2,
        data_status: 'streaming',
      }
      onSymbolResolvedCallback(symbolInfo)
    },
    getBars: async (
      symbolInfo: any,
      resolution: any,
      periodParams: any,
      onHistoryCallback: any,
      onErrorCallback: any,
    ) => {
      const { from, to, firstDataRequest } = periodParams

      console.log('............from', from)
      console.log('............to', to)
      console.log('............firstDataRequest', firstDataRequest)

      try {
        const data = await makeApiRequest1(input, routerVersion, resolution)
        if (result) {
          if (!firstDataRequest) {
            // "noData" should be set if there is no data in the requested period.
            onHistoryCallback([], {
              noData: true,
            })
            return
          }
        }

        let bars: any = []
        data.map((bar: any, i: any) => {
          const obj: any = {
            time: new Date(bar.time).getTime(),
            low: bar.low * bar.baseLow,
            high: bar.high * bar.baseHigh,
            open: bar.open * bar.baseOpen,
            close: bar.close * bar.baseClose,
            volume: bar.volume,
            isBarClosed: true,
            isLastBar: false,
          }
          if (i === data.length - 1) {
            obj.isLastBar = true
            obj.isBarClosed = false
            lastBarsCache = obj
          }
          bars = [...bars, obj]
          priceRef.current = obj.close
          amountRef.current = obj.volume
          return {}
        })
        // eslint-disable-next-line no-console
        onHistoryCallback(bars, {
          noData: false,
        })
      } catch (error) {
        onErrorCallback(error)
      }
    },
    subscribeBars: (
      symbolInfo: any,
      resolution: any,
      onRealtimeCallback: any,
      subscribeUID: any,
      onResetCacheNeededCallback: any,
    ) => {
      console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID)

      currentResolutions = resolution
      myInterval = setInterval(async function () {
        const resolutionMapping: any = {
          '1': 60000,
          '5': 300000,
          '10': 600000,
          '15': 900000,
          '30': 1800000,
          '60': 3600000,
          '1H': 3600000,
          '1D': 24 * 3600000,
          '1W': 7 * 24 * 3600000,
          '1M': 30 * 24 * 3600000,
        }
        
        if (lastBarsCache === undefined) return
        if (priceRef.current === UNSET_PRICE) return
        const isNew = new Date().getTime() - Number(lastBarsCache.time) >= resolutionMapping[currentResolutions]

        lastBarsCache.close = priceRef.current
        lastBarsCache.volume = amountRef.current
        if (isNew) {
          lastBarsCache.time = new Date().getTime()
          lastBarsCache.open = lastBarsCache.close
          lastBarsCache.high = lastBarsCache.close
          lastBarsCache.low = lastBarsCache.close
          amountRef.current = 0
        } else {
          if (Number(lastBarsCache.low) > Number(lastBarsCache.close)) {
            lastBarsCache.low = lastBarsCache.close
          }
          if (Number(lastBarsCache.high) < Number(lastBarsCache.close)) {
            lastBarsCache.high = lastBarsCache.close
          }
        }

        onRealtimeCallback(lastBarsCache)
      }, 1000 * 5) // 5s update interval
    },
    unsubscribeBars: (subscriberUID) => {
      console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID)
      console.log('[unsubscribeBars]: cleared')
    },
  }

  const getWidget = async () => {
    let tvWidget: IChartingLibraryWidget | null = null
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: tokendetails.pair,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: feed,
      interval: ChartContainerProps.interval as ChartingLibraryWidgetOptions['interval'],
      library_path: ChartContainerProps.libraryPath as string,
      container: ChartContainerProps.container as ChartingLibraryWidgetOptions['container'],
      locale: getLanguageFromURL() || 'en',
      theme: 'Dark',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: ChartContainerProps.chartsStorageUrl,
      client_id: ChartContainerProps.clientId,
      user_id: ChartContainerProps.userId,
      fullscreen: ChartContainerProps.fullscreen,
      autosize: ChartContainerProps.autosize,
      studies_overrides: ChartContainerProps.studiesOverrides,
    }

    tvWidget = await new widget(widgetOptions)
  }

  React.useEffect(() => {
    getWidget()
  }, [input])

  React.useEffect(() => {
    priceRef.current = realPrice
  }, [realPrice])

  React.useEffect(() => {
    amountRef.current = amountRef.current + realAmount
  }, [realAmount])

  return (
    <ChartContainer height={props.height}>
      <div id={ChartContainerProps.container} style={{ height: '100%', paddingBottom: '10px' }} />
    </ChartContainer>
  )
}

export default PcsChartContainer
