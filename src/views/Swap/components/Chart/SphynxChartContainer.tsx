/* eslint-disable */
import * as React from 'react'
import styled from 'styled-components'
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  IChartingLibraryWidget,
  ResolutionString,
} from 'charting_library/charting_library'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { getUnixTime, startOfHour, Duration, sub } from 'date-fns'
import { AppState } from 'state'
import { PoolData } from 'state/info/types'
import fetchTokenPriceData from 'state/info/queries/tokens/priceData'
import { fetchPoolData } from 'state/info/queries/pools/poolData'
import { isAddress } from 'utils'

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
  height: number
}

const ChartContainerProps = {
  symbol: 'AAPL',
  interval: 'H' as ResolutionString,
  containerId: 'sphynx_chart_container',
  datafeedUrl: 'https://demo_feed.tradingview.com',
  libraryPath: '/charting_library/',
  chartsStorageUrl: 'https://saveload.tradingview.com',
  chartsStorageApiVersion: '1.0',
  clientId: 'tradingview.com',
  userId: 'public_user_id',
  fullscreen: false,
  autosize: true,
  studiesOverrides: {},
  height: 600
}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)')
  const results = regex.exec(location.search)
  return results === null ? null : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode)
}

const SphynxChartContainer: React.FC<Partial<ChartContainerProps>> = (props) => {

  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  // const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)
  const checksumAddress = isAddress(input)

  const [tokendetails, setTokenDetails] = React.useState({
    pair: ' ',
  })

  const fetchPriceData = async(resolution) => {
    if (checksumAddress) {
      let interval = 3600 // one hour per seconds
      let duration: Duration = { weeks: 1 }

      if (resolution === '1') {
        interval = 60
        duration = { hours: 6 }
      } else if (resolution === '5') {
        interval = 300
        duration = { hours: 12 }
      } else if (resolution === '10') {
        interval = 600
        duration = { days: 1 }
      } else if (resolution === '15') {
        interval = 900
        duration = { days: 2 }
      } else if (resolution === '30') {
        interval = 1800
        duration = { days: 3 }
      } else if (resolution === '1H') {
        interval = 3600
        duration = { months: 6 }
      } else if (resolution === '1D') {
        interval = 86400
        duration = { months: 6 }
      } else if (resolution === '1W') {
        interval = 604800
        duration = { years: 6 }
      } else if (resolution === '1M') {
        interval = 18144000
        duration = { years: 12 }
      }

      const utcCurrentTime = getUnixTime(new Date()) * 1000
      const startTimestamp = getUnixTime(startOfHour(sub(utcCurrentTime, duration)))

      const { error: fetchError3, data:priceData } = await fetchTokenPriceData(
        checksumAddress.toLocaleLowerCase(),
        interval,
        startTimestamp
      )
      return priceData
    }
    return []
  }

  // const lastBarsCache = new Map()

  const configurationData = {
    supported_resolutions: ['1', '5', '10', '15', '30', '1H', '1D', '1W', '1M']
  }
  async function getAllSymbols() {
    let allSymbols: any = []
    return allSymbols
  }
  const feed = {
    onReady: (callback: any) => {
      // console.log('[onReady]: Method call');
      setTimeout(() => callback(configurationData), 0)
    },
    // searchSymbols: async (userInput: any, exchange: any, symbolType: any, onResultReadyCallback: any) => {
    //   // console.log('[searchSymbols]: Method call');
    //   const symbols = await getAllSymbols()
    //   const newSymbols = symbols.filter((symbol) => {
    //     const isExchangeValid = exchange === '' || symbol.exchange === exchange
    //     const isFullSymbolContainsInput = symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1
    //     return isExchangeValid && isFullSymbolContainsInput
    //   })
    //   onResultReadyCallback(newSymbols)
    // },
    resolveSymbol: async (symbolName: any, onSymbolResolvedCallback: any, onResolveErrorCallback: any) => {
      const response = await axios.get(`https://thesphynx.co/api/tokenDetails/${checksumAddress}`)
      setTokenDetails(response.data)

      const symbolInfo = {
        ticker: response.data.pair,
        name: response.data.pair,
        description: response.data.sybmol,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: 'Sphynx',
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
      try {
        const { from, to, firstDataRequest } = periodParams
        if (checksumAddress) {
          // setLoader(true);
          if (!firstDataRequest) {
            // "noData" should be set if there is no data in the requested period.
            onHistoryCallback([], {
              noData: true,
            })
            return
          }
        }

        const data = await fetchPriceData(resolution)
        // console.log(data)

        let bars: any = []
        // if(data.data.data){
        data.map((bar: any, i: any) => {
          const obj = {
            time: bar.time * 1000,
            low: bar.low,
            high: bar.high,
            open: bar.open,
            close: bar.close,
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
      container: 'sphynx_chart_container',
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
  }
  
  React.useEffect(() => {
    getWidget()
  }, [])

  return (
    <ChartContainer height={props.height}>
      <div id={ChartContainerProps.containerId} style={{ height: '100%', paddingBottom: '10px' }} />
    </ChartContainer>
  )
}

export default SphynxChartContainer