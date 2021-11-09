import React, { useState, useRef, useEffect } from 'react'
import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import WatchIcon from 'components/Icon/WatchIcon'

const DistributionWrapper = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    color: white;
    max-width: 410px;
    padding-left: 38px;
    background-color: ${({ theme }) => theme.isDark ? "transparent" : "#2A2E60"};
    border-radius: 10px;
  }
`

const DistributionContent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  margin-left: 12px;
`

const TimeSpan = styled.div`
  display: block;
`

const TimeContent = styled.div`
  display: flex;
  flex-directioin: column;
  justify-content: space-between;
  max-width: 232px;
`

// const TimeSpan = (time?: number, timeUnit?: string) => {

//   return (
//     <TimeSpan>
//       <Text>{time}</Text>
//       <Text>{timeUnit}</Text>
//     </TimeSpan>
//   )

// }

const RewardsPanel: React.FC = () => {
  const { t } = useTranslation()
  const [time, setRemainTime] = useState(0)
  const interval = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    const remainTime = () => {
      const finishDate = new Date('11/01/2021 12:00:00 UTC').getTime()
      let remain = finishDate - new Date().getTime()
      if (remain < 0) {
        for (; ;) {
          remain += 3600 * 1000 * 24 * 7;
          if (remain > 0)
            break;
        }
      }
      setRemainTime(remain)
    }
    const ab = new AbortController()
    interval.current = setInterval(() => {
      remainTime()
    }, 1000)
    return () => {
      clearInterval(interval?.current)
      ab.abort();
    }
  }, [])

  return (
    <DistributionWrapper>
      <Flex justifyContent="flex-end">
        {/* <img src={StopwatchIcon} alt="stopwatch icon" width="90" height="90" /> */}
        <WatchIcon width="61px" height="72px" color={theme.isDark ? "#A7A7CC":"#F2C94C"}/>
        <DistributionContent>
          <Text color={theme.isDark ? "#C32BB4" : "#F2C94C"} bold>
            {t('Distribution In:')}
          </Text>
          <TimeContent>
            <TimeSpan>
              <Text color="white" textAlign="center" bold fontSize="14px">
                {Math.floor(time / 86400000).toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false
                })}
              </Text>
              <Text color="#A7A7CC" textTransform="uppercase" fontSize="12px">{t('days')}</Text>
            </TimeSpan>
            <Text>:</Text>
            <TimeSpan>
              <Text color="white" textAlign="center" bold fontSize="14px">
                {Math.floor((time % 86400000) / 3600000).toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false
                })}</Text>
              <Text color="#A7A7CC" textTransform="uppercase" fontSize="12px">{t('hrs')}</Text>
            </TimeSpan>
            <Text color="white">:</Text>
            <TimeSpan>
              <Text color="white" textAlign="center" bold fontSize="14px">
                {Math.floor((time % 3600000) / 60000).toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false
                })}</Text>
              <Text color="#A7A7CC" textTransform="uppercase" fontSize="12px">{t('min')}</Text>
            </TimeSpan>
            <Text color="white">:</Text>
            <TimeSpan>
              <Text color="white" textAlign="center" bold fontSize="14px">
                {Math.floor(time % 60000 / 1000).toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false
                })}</Text>
              <Text color="#A7A7CC" textTransform="uppercase" fontSize="12px">{t('sec')}</Text>
            </TimeSpan>
          </TimeContent>
        </DistributionContent>
      </Flex>
    </DistributionWrapper>
  )
}

export default RewardsPanel
