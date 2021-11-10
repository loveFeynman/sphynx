import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import React from 'react'
import { CardBody, Flex, Text, CardRibbon } from '@sphynxswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const StyledCardBody = styled(CardBody)`
  background-color: transparent;
`

const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)
  const buttonStyle = {
    borderRadius: '5px',
    border: 'none',
    width: '230px',
    height: '34px',
    fontSize: '13px',
    background: 'linear-gradient(90deg, #610D89 0%, #C42BB4 100%)'
  }

  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <StyledCardHeader
        isStaking={accountHasStakedBalance}
        earningToken={earningToken}
        stakingToken={stakingToken}
        isFinished={isFinished && sousId !== 0}
      />
      <StyledCardBody>
        <AprRow pool={pool} />
        <Flex mt="24px" flexDirection="column" alignItems='center' style={{}}>
          {account ? (
            <CardActions pool={pool} stakedBalance={stakedBalance} />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="14px" color="#A7A7CC">
                {t('Start earning')}
              </Text>
              <ConnectWalletButton style={buttonStyle}/>
            </>
          )}
        </Flex>
      </StyledCardBody>
      <CardFooter pool={pool} account={account} />
    </StyledCard>
  )
}

export default PoolCard
