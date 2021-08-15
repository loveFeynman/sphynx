import React from 'react'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'
import Marquee from "react-fast-marquee";
import { ReactComponent as HelpIcon } from 'assets/svg/icon/HelpIcon.svg'
import { ReactComponent as DownRedArrowIcon} from 'assets/svg/icon/DownRedArrowIcon.svg'
import { ReactComponent as UpGreenArrowIcon} from 'assets/svg/icon/UpGreenArrowIcon.svg'
import { HotTokenType } from './types'

export interface HotTokenBarProps {
  tokens?: HotTokenType[] | null
}

const StyledBar = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 30px;
  & span {
    font-family: 'Roboto Regular'
  }
`

const FlowBar = styled.div`
  width: calc(100% - 100px);
  background-color: rgba(0,0,0,0.2);
  border-radius: 0px 12px 12px 0px;
  padding: 6px;
`

const BarIntro = styled.div`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  color: #fff;
  background-color: #101010;
  border-radius: 8px 0px 0px 8px;
  & span {
    font-size: 12px;
    line-height: 14px;
  }
`

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  width: fit-content;
  margin-left: 16px;
  &:hover {
    text-decoration: none;
  }
  & svg {
    margin-right: 8px;
  }
  & span:last-child {
    font-weight: bold;
    color: white;
    text-transform: uppercase;
  }
`;

const RankingColor = [
  '#F7931A',
  '#ACACAC',
  '#6E441E',
  '#C5C5C5',
  '#C5C5C5',
  '#C5C5C5',
  '#C5C5C5',
  '#C5C5C5',
  '#C5C5C5',
  '#C5C5C5',
  '#C5C5C5',
  '#C5C5C5'
]

const Ranking = styled.span<{
  index1: number
}>`
  padding-right: 8px;
  color: ${({index1}) => RankingColor[index1 - 1]};
`

const HotToken = ({
  index,
  dexId,
  name,
  symbol,
  direction
}: {
  index: number,
  dexId: string,
  name: string,
  symbol: string,
  direction: string | undefined,
}) => {
  return (
    <StyledLink href={`/#/swap/${dexId}`} fontSize="14px">
      <Ranking index1={index}>#{index}</Ranking>
      {
        direction && direction === 'up' && <UpGreenArrowIcon />
      }
      {
        direction && direction === 'down' && <DownRedArrowIcon />
      }
      <span>{name}</span>
    </StyledLink>
  )
}

export default function HotTokenBar({
  tokens
}: HotTokenBarProps) {
  return (
    <StyledBar>
      <BarIntro><span>Top Pairs</span> <HelpIcon /></BarIntro>
      <FlowBar>
        <Marquee gradient={false}>
          <ul style={{ display: 'flex', listStyle: 'none', justifyContent: 'center', width: 'calc(100% - 120px)' }}>
          {
            tokens ? tokens.map((token, key) => {
              return (
                <li key={`${token.symbol}${key + 1}`}>
                  <HotToken
                    index={key + 1}
                    dexId={token.dexId}
                    symbol={token.symbol}
                    name={token.name}
                    direction={token.direction}
                  />
                </li>
              )
            }) : <></>
          }
          </ul>
        </Marquee>
      </FlowBar>
      <div className="paddingRight: 30px" />
    </StyledBar>
  )
}
