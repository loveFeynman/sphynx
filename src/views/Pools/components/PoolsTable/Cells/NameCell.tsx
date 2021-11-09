import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCakeVault } from 'state/pools/hooks'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenPairImage } from 'components/TokenImage'
import CakeVaultTokenPairImage from '../../CakeVaultCard/CakeVaultTokenPairImage'
import BaseCell, { CellContent } from './BaseCell'

interface NameCellProps {
  pool: Pool
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  align-items: center;
  flex-direction: row;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 200px;
  }
`

const NameCell: React.FC<NameCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { sousId, stakingToken, earningToken, userData, isFinished, isAutoVault } = pool
  const {
    userData: { userShares },
  } = useCakeVault()
  const hasVaultShares = userShares && userShares.gt(0)

  const stakingTokenSymbol = stakingToken.symbol
  const earningTokenSymbol = earningToken.symbol

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)
  const isManualCakePool = sousId === 0

  const showStakedTag = isAutoVault ? hasVaultShares : isStaked

  let title = `${t('Earn')} ${earningTokenSymbol}`
  let subtitle = `${t('Stake')} ${stakingTokenSymbol}`
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isXs && !isSm)

  if (isAutoVault) {
    title = t('Auto SPHYNX')
    subtitle = t('Automatic restaking')
  } else if (isManualCakePool) {
    title = t('Manual SPHYNX')
    subtitle = `${t('Earn')} SPHYNX ${t('Stake').toLocaleLowerCase()} SPHYNX`
  }

  return (
    <StyledCell role="cell">
        {isAutoVault ? (
          <CakeVaultTokenPairImage mr="8px" width={70} height={70} />
        ) : (
          <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} mr="8px" width={70} height={70} />
        )}
      <CellContent>
        {showStakedTag && (
          <Text fontSize="12px" bold color={isFinished ? 'failure' : 'secondary'} textTransform="uppercase">
            {t('Staked')}
          </Text>
        )}
        <Text fontSize="20px" bold={!isXs && !isSm} small={isXs || isSm} mb='5px'>
          {title}
        </Text>
        {showSubtitle && (
          <Text fontSize="15px" color="#777777">
            {subtitle}
          </Text>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
