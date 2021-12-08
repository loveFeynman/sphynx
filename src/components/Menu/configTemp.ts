import { SVGProps } from 'react'
import { ContextApi } from 'contexts/Localization/types'
import { ReactComponent as FarmIcon } from 'assets/svg/icon/FarmIcon.svg'
import { ReactComponent as PoolIcon } from 'assets/svg/icon/PoolIcon.svg'
import { ReactComponent as BridgeIcon } from 'assets/svg/icon/Bridge.svg'
import { ReactComponent as LaunchPadIcon } from 'assets/svg/icon/LaunchIcon.svg'
import { ReactComponent as PredictionIcon } from 'assets/svg/icon/PredictionIcon.svg'
import { ReactComponent as IFOIcon } from 'assets/svg/icon/IFOIcon.svg'
import { ReactComponent as ChartIcon } from 'assets/svg/icon/chart-swap.svg'
import { ReactComponent as CoingeckoIcon } from 'assets/svg/icon/Coingecko.svg'
import { ReactComponent as CoinMarketCapsIcon } from 'assets/svg/icon/CoinMarketCaps.svg'
import { ReactComponent as LearningHubIcon } from 'assets/svg/icon/LearningHub.svg'
import { ReactComponent as FAQIcon } from 'assets/svg/icon/HelpIcon.svg'
import { ReactComponent as LockIcon } from 'assets/svg/icon/LockIcon.svg'
import { PredictionsIcon } from '@sphynxdex/uikit'

export const linksTemp = [
  {
    baseurl: 'swap',
    name: 'DEX & Charts',
    Icon: ChartIcon,
    link: '/swap',
  },
  {
    baseurl: 'earn',
    name: 'Earn',
    Icon: FarmIcon,
    items: [
      {
        name: 'Farming',
        link: '/earn/farms'
      },
      {
        name: 'Staking',
        link: '/earn/pools'
      },
    ]
  },
  {
    baseurl: 'launchpad',
    name: 'Launchpad',
    Icon: LaunchPadIcon,
    items: [
      {
        name: 'Sphynx Pad',
        link: '/launchpad'
      },
      {
        name: 'Projects on Sphynx Swap',
        link: '/launchpad/listing'
      },
      {
        name: 'Fair Launch',
        link: '/launchpad/fair'
      },
      {
        name: 'Fair Launch List',
        link: '/launchpad/fair/listing'
      },
      {
        name: 'Sphynx Locks',
        link: '/launchpad/locker'
      },
      {
        name: 'Sphynx Locker',
        link: '/launchpad/locker/manage'
      },
    ]
  },
  {
    baseurl: 'lottery',
    name: 'Lottery',
    Icon: IFOIcon,
    link: '/lottery'
  },
  {
    baseurl: 'bridge',
    name: 'Bridge',
    Icon: BridgeIcon,
    link: '/bridge'
  },
  {
    baseurl: 'coming-soon',
    name: 'Coming Soon',
    Icon: PredictionIcon,
    items:[
      {
        name: 'NFT marketplace',
        link: '/'
      },
      {
        name: 'Prediciations',
        link: '/'
      },
      {
        name: 'Sphynx TV',
        link: '/'
      },
    ]
  },
  {
    baseurl: 'faq',
    name: 'FAQ',
    Icon: FAQIcon,
    items: [
      {
        name: 'Learning Hub',
        link: 'https://www.sphynxlearning.co/'
      },
      {
        name: 'CMC',
        link: 'https://coinmarketcap.com/'
      },
      {
        name: 'CoinGecko',
        link: 'https://www.coingecko.com/en'
      },
    ]
  }
]

interface MenuSubEntry {
  name: string
  link: string
}

interface MenuEntry {
  name: string
  Icon: React.FunctionComponent<SVGProps<SVGSVGElement>>
  items?: MenuSubEntry[]
  link?: string
}

const config: (t: ContextApi['t']) => MenuEntry[] = () => linksTemp

export default config
