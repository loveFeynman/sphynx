// import { MenuEntry } from '@pancakeswap/uikit'
import { SVGProps } from "react";
import { ContextApi } from 'contexts/Localization/types'
import { ReactComponent as FarmIcon } from 'assets/svg/icon/FarmIcon.svg'
import { ReactComponent as PoolIcon } from 'assets/svg/icon/PoolIcon.svg'
import { ReactComponent as PredictionIcon } from 'assets/svg/icon/PredictionIcon.svg'
import { ReactComponent as IFOIcon } from 'assets/svg/icon/IFOIcon.svg'
import { ReactComponent as MoreIcon } from 'assets/svg/icon/MoreIcon.svg'
import { ReactComponent as ChartIcon }  from 'assets/svg/icon/chart-swap.svg'

export const links = [
  // {
  //   label: 'Home',
  //   icon: 'HomeIcon',
  //   href: '/',
  // },
  {
    label: 'Swap & charts',
    icon: ChartIcon,
    href: '/swap',
  },
  {
    label: 'Farms',
    icon: FarmIcon,
    href: 'https://farm.sphynxswap.finance/farms'
  },
  {
    label: 'Pools',
    icon: PoolIcon,
    href: 'https://farm.sphynxswap.finance/pools'
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
  {
    label: 'IFO',
    icon: IFOIcon,
    items: [
      {
        label: 'PancakeSwap',
        href: 'https://pancakeswap.info/token/0xF952Fc3ca7325Cc27D15885d37117676d25BfdA6',
      },
      {
        label: 'CoinGecko',
        href: 'https://www.coingecko.com/en/coins/goose-finance',
      },
      {
        label: 'CoinMarketCap',
        href: 'https://coinmarketcap.com/currencies/goose-finance/',
      },
      {
        label: 'AstroTools',
        href: 'https://app.astrotools.io/pancake-pair-explorer/0x19e7cbecdd23a16dfa5573df54d98f7caae03019',
      },
    ],
  },
  {
    label: '... More',
    icon: MoreIcon,
    items: [
      {
        label: 'Contact',
        href: 'https://docs.pancakeswap.finance/contact-us',
      },
      {
        label: 'Voting',
        href: '/voting',
      },
      {
        label: 'Github',
        href: 'https://github.com/pancakeswap',
      },
      {
        label: 'Docs',
        href: 'https://docs.pancakeswap.finance',
      },
      {
        label: 'Blog',
        href: 'https://pancakeswap.medium.com',
      },
      {
        label: 'Merch',
        href: 'https://pancakeswap.creator-spring.com/',
      },
    ],
  }
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
