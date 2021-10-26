/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { RouterTypeToggle } from 'config/constants/types'
import TransactionNav from 'components/TransactionNav'
import { AppState } from 'state'
import { ReactComponent as UpDownArrow } from 'assets/svg/icon/UpDownArrow.svg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

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

const PcsChartContainer = React.lazy(() => import("./PcsChartContainer"))
const SphynxChartContainer = React.lazy(() => import("./SphynxChartContainer"))

const ChartContainer = ({tokenAddress, priceScale}) => {
  const input = tokenAddress
  const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)

  const draggableArrow = React.useRef<any>(null)
  const [chartHeight, setChartHeight] = React.useState(600)
  const [dragPos, setDragPos] = React.useState(0)
  const [isPancakeRouter, setIsPancakeRouter] = useState(false)

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

  useEffect(() => {
    let isPancakeRouterNew = true
    isPancakeRouterNew = routerVersion !== "sphynx"

    setIsPancakeRouter(isPancakeRouterNew)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, routerVersion])

  return (
    <Wrapper>
      {isPancakeRouter ? <PcsChartContainer tokenAddress={input} height={chartHeight} priceScale={priceScale} /> : <SphynxChartContainer tokenAddress={input} height={chartHeight} priceScale={priceScale} />}
      <UpDownArrowBox>
        <ArrowWrapper
          ref={draggableArrow}
          draggable="true"
          onDragStart={(e) => handleDragStart(e)}
          onDragOver={(e) => handleDrag(e)}
        >
          <UpDownArrow />
        </ArrowWrapper>
        <TransactionNavWrapper>
          <TransactionNav />
        </TransactionNavWrapper>
      </UpDownArrowBox>
    </Wrapper>
  )
};

export default ChartContainer
