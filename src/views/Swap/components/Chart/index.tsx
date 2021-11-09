/* eslint-disable */
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
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

const Chart = React.lazy(() => import("./ChartContainer"))

const ChartContainer = ({tokenAddress, tokenData}) => {
  const input = tokenAddress
  const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)

  const draggableArrow = React.useRef<any>(null)
  const [chartHeight, setChartHeight] = React.useState(600)
  const [dragPos, setDragPos] = React.useState(0)

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
    <Wrapper>
      <Chart tokenAddress={input} height={chartHeight} />
      <UpDownArrowBox>
        <ArrowWrapper
          ref={draggableArrow}
          draggable="true"
          onDragStart={(e) => handleDragStart(e)}
          onDragOver={(e) => handleDrag(e)}
        >
          <UpDownArrow />
        </ArrowWrapper>
      </UpDownArrowBox>
    </Wrapper>
  )
};

export default ChartContainer
