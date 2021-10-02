import { SVGProps } from 'react'
import { ContextApi } from 'contexts/Localization/types'
import { ReactComponent as FarmIcon } from 'assets/svg/icon/FarmIcon.svg'
import { ReactComponent as PoolIcon } from 'assets/svg/icon/PoolIcon.svg'
import { ReactComponent as BridgeIcon } from 'assets/svg/icon/Bridge.svg'
import { ReactComponent as PredictionIcon } from 'assets/svg/icon/PredictionIcon.svg'
import { ReactComponent as IFOIcon } from 'assets/svg/icon/IFOIcon.svg'
import { ReactComponent as ChartIcon } from 'assets/svg/icon/chart-swap.svg'
import { ReactComponent as CoingeckoIcon } from 'assets/svg/icon/Coingecko.svg'
import { ReactComponent as CoinMarketCapsIcon } from 'assets/svg/icon/CoinMarketCaps.svg'
import { ReactComponent as LearningHubIcon } from 'assets/svg/icon/LearningHub.svg'
import { ReactComponent as FAQIcon } from 'assets/svg/icon/HelpIcon.svg'

export const links = [
  {
    label: 'Swap & charts',
    icon: ChartIcon,
    href: '/#/swap',
  },
  {
    label: 'Farms',
    icon: FarmIcon,
    href: '/#/farms',
  },
  {
    label: 'Pools',
    icon: PoolIcon,
    href: '/#/pools',
  },
  {
    label: 'Lottery',
    icon: IFOIcon,
    href: '/#/lottery',
  },
  {
    label: 'Bridge',
    icon: BridgeIcon,
    href: '/#/bridge', // 'https://farm.sphynxswap.finance/bridge'
  },
  {
    label: 'CoinMarketCap',
    icon: CoinMarketCapsIcon,
    href: 'https://coinmarketcap.com/',
    newTab: true
  },
  {
    label: 'CoinGecko',
    icon: CoingeckoIcon,
    href: 'https://www.coingecko.com/en/coins/sphynx-token',
    newTab: true
  },
  {
    label: 'Learning Hub',
    icon: LearningHubIcon,
    href: 'https://www.sphynxlearning.co/',
    newTab: true
  },
  {
    label: 'NFT Marketplace (coming soon)',
    icon: PredictionIcon,
    href: '#',
  },
  {
    label: 'Prediction (coming soon)',
    icon: PredictionIcon,
    href: '#',
  },
  {
    label: 'FAQ',
    icon: FAQIcon,
    href: '/#/faq',
  },
]

interface MenuSubEntry {
  label: string
  href: string
}

interface MenuEntry {
  label: string
  icon: React.FunctionComponent<SVGProps<SVGSVGElement>>
  items?: MenuSubEntry[]
  href?: string
}

const config: (t: ContextApi['t']) => MenuEntry[] = () => links

export default config
