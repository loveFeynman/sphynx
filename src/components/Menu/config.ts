// import { MenuEntry } from '@pancakeswap/uikit'
import { SVGProps } from "react";
import { ContextApi } from 'contexts/Localization/types'
import { ReactComponent as FarmIcon } from 'assets/svg/icon/FarmIcon.svg'
import { ReactComponent as PoolIcon } from 'assets/svg/icon/PoolIcon.svg'
import { ReactComponent as BridgeIcon } from 'assets/svg/icon/Bridge.svg'
import { ReactComponent as PredictionIcon } from 'assets/svg/icon/PredictionIcon.svg'
import { ReactComponent as IFOIcon } from 'assets/svg/icon/IFOIcon.svg'
import { ReactComponent as MoreIcon } from 'assets/svg/icon/MoreIcon.svg'
import { ReactComponent as ChartIcon }  from 'assets/svg/icon/chart-swap.svg'
import { ReactComponent as CoingeckoIcon }  from 'assets/svg/icon/Coingecko.svg'
import { ReactComponent as CoinMarketCapsIcon }  from 'assets/svg/icon/CoinMarketCaps.svg'
import { ReactComponent as LearningHubIcon }  from 'assets/svg/icon/LearningHub.svg'

export const links = [
  // {
  //   label: 'Home',
  //   icon: 'HomeIcon',
  //   href: '/',
  // },
  {
    label: 'Swap & charts',
    icon: ChartIcon,
    href: '/#/swap',
  },
  {
    label: 'Farms',
    icon: FarmIcon,
    href: '/#/farms' // 'https://farm.sphynxswap.finance/farms'
  },
  {
    label: 'Pools',
    icon: PoolIcon,
    href: '/#/pools' // 'https://farm.sphynxswap.finance/pools'
  },
  {
    label: 'bridge',
    icon: BridgeIcon,
    href: '/#/bridge' // 'https://farm.sphynxswap.finance/bridge'
  },
  {
    label: 'CoinMarketCap',
    icon: CoinMarketCapsIcon,
    href: 'https://coinmarketcap.com/',
  },
  {
    label: 'CoinGecko',
    icon: CoingeckoIcon,
    href: 'https://www.coingecko.com/',
  },
  {
    label: 'Learning Hub',
    icon: LearningHubIcon,
    href: 'https://cryptolearnhub.com/',
  },
  {
    label: 'NFT Marketplace (coming soon)',
    icon: PredictionIcon,
    href: '/'
  },
  {
    label: 'Prediction (coming soon)',
    icon: PredictionIcon,
    href: '/',
  },
  // {
  //   label: '... More',
  //   icon: MoreIcon,
  //   items: [
  //     {
  //       label: 'Contact',
  //       href: 'https://docs.pancakeswap.finance/contact-us',
  //     },
  //     {
  //       label: 'Voting',
  //       href: '/voting',
  //     },
  //     {
  //       label: 'Github',
  //       href: 'https://github.com/pancakeswap',
  //     },
  //     {
  //       label: 'Docs',
  //       href: 'https://docs.pancakeswap.finance',
  //     },
  //     {
  //       label: 'Blog',
  //       href: 'https://pancakeswap.medium.com',
  //     },
  //     {
  //       label: 'Merch',
  //       href: 'https://pancakeswap.creator-spring.com/',
  //     },
  //   ],
  // }
]

interface MenuSubEntry {
  label: string;
  href: string;
}

interface MenuEntry {
  label: string;
  icon: React.FunctionComponent<SVGProps<SVGSVGElement>>;
  items?: MenuSubEntry[];
  href?: string;
}

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => links

export default config
