/* eslint-disable */
import * as React from 'react'
import styled from 'styled-components'
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  widget,
} from 'charting_library/charting_library'
import { useSelector } from 'react-redux'
import { Duration, getUnixTime, startOfHour, sub } from 'date-fns'
import { AppState } from 'state'
import fetchTokenPriceData from 'state/info/queries/tokens/priceData'
import { isAddress } from 'utils'
import getTokenDetails from '../../../../utils/getTokenDetails'

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
  interval: 'H' as ResolutionString,
  container: 'sphynx_chart_container',
  datafeedUrl: 'https://demo_feed.tradingview.com',
  libraryPath: '/charting_library/',
  chartsStorageUrl: 'https://saveload.tradingview.com',
  chartsStorageApiVersion: '1.0',
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

const SphynxChartContainer: React.FC<Partial<ChartContainerProps>> = (props) => {
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const checksumAddress = isAddress(input)

  const [tokendetails, setTokenDetails] = React.useState({
    pair: ' ',
  })

  const fetchPriceData = async (resolution) => {
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

      const { error: fetchError3, data: priceData } = await fetchTokenPriceData(
        checksumAddress.toLocaleLowerCase(),
        interval,
        startTimestamp,
      )
      return priceData
    }
    return []
  }

  // const lastBarsCache = new Map()

  const configurationData = {
    supported_resolutions: ['1', '5', '10', '15', '30', '1H', '1D', '1W', '1M'],
  }
  async function getAllSymbols() {
    let allSymbols: any = []
    return allSymbols
  }
  const feed = {
    onReady: (callback: any) => {
      setTimeout(() => callback(configurationData), 0)
    },
    resolveSymbol: async (symbolName: any, onSymbolResolvedCallback: any, onResolveErrorCallback: any) => {
      const response = await getTokenDetails(checksumAddress.toString())
      setTokenDetails(response)

      const symbolInfo = {
        ticker: response.pair,
        name: response.pair,
        description: response.symbol,
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
          if (!firstDataRequest) {
            // "noData" should be set if there is no data in the requested period.
            onHistoryCallback([], {
              noData: true,
            })
            return
          }
        }

        const data = await fetchPriceData(resolution)
        let bars: any = []
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
        onErrorCallback(error)
      }
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
  }, [])

  return (
    <ChartContainer height={props.height}>
      <div id={ChartContainerProps.container} style={{ height: '100%', paddingBottom: '10px' }} />
    </ChartContainer>
  )
}

export default SphynxChartContainer
