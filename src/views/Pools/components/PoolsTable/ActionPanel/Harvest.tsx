import React from 'react'
import { Button, Text, useModal, Flex, TooltipText, useTooltip, Skeleton, Heading } from '@sphynxswap/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import { PoolCategory } from 'config/constants/types'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { useCakeVault } from 'state/pools/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import SphynxTokenLogo from 'assets/images/MainLogo.png'

import { HarvestActionContainer, ActionTitles, ActionContent } from './styles'
import CollectModal from '../../PoolCard/Modals/CollectModal'
import UnstakingFeeCountdownRow from '../../CakeVaultCard/UnstakingFeeCountdownRow'

interface HarvestActionProps extends Pool {
  userDataLoaded: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  sousId,
  poolCategory,
  earningToken,
  userData,
  userDataLoaded,
  isAutoVault,
  earningTokenPrice,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  // These will be reassigned later if its Auto SPHYNX vault
  let earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  let earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  let hasEarnings = earnings.gt(0)
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const isCompoundPool = sousId === 0
  const isBnbPool = poolCategory === PoolCategory.BINANCE

  // Auto SPHYNX vault calculations
  const {
    userData: { cakeAtLastUserAction, userShares },
    pricePerFullShare,
    fees: { performanceFee },
  } = useCakeVault()
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
  )

  earningTokenBalance = isAutoVault ? autoCakeToDisplay : earningTokenBalance
  hasEarnings = isAutoVault ? hasAutoEarnings : hasEarnings
  earningTokenDollarBalance = isAutoVault ? autoUsdToDisplay : earningTokenDollarBalance

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningTokenDollarBalance}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  )

  const actionTitle = isAutoVault ? (
    <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase">
      {t('Recent SPHYNX profit')}
    </Text>
  ) : (
    <>
      <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase">
        {earningToken.symbol}{' '}
      </Text>
      <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase">
        {t('Earned')}
      </Text>
    </>
  )

  const buttonStyle = {
    borderRadius: '5px',
    border: 'none',
    width: '200px',
    height: '34px',
    fontSize: '13px',
    background: '#0E0E26'
  }

  if (!account) {
    return (
      <HarvestActionContainer>
        <Flex flexDirection='row' alignItems='center'>
          <img src={SphynxTokenLogo} style={{ height: '70%', marginLeft: '4px' }} alt="token" />
          <Flex flexDirection="column">
            <ActionTitles>{actionTitle}</ActionTitles>
            <Text fontSize="24px" color="textDisabled">
              $0
            </Text>
          </Flex>
        </Flex>
        <ActionContent>
          <Button style={buttonStyle} disabled>{isCompoundPool ? t('Collect') : t('Harvest')}</Button>
        </ActionContent>
      </HarvestActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <HarvestActionContainer>
        <Flex flexDirection='row' alignItems='center'>
          <img src={SphynxTokenLogo} style={{ height: '70%', marginLeft: '4px' }} alt="token" />
          <Flex flexDirection="column">
            <ActionTitles>{actionTitle}</ActionTitles>
          </Flex>
        </Flex>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </HarvestActionContainer>
    )
  }
  return (
    <HarvestActionContainer>
      <Flex flexDirection='row' alignItems='center'>
        <img src={SphynxTokenLogo} style={{ height: '70%', marginLeft: '4px' }} alt="token" />
        <Flex flexDirection="column">
          <ActionTitles>{actionTitle}</ActionTitles>
          <Flex flex="1" alignSelf="flex-start">
            <>
              {hasEarnings ? (
                <>
                  {/* <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={earningTokenBalance} /> */}
                  {earningTokenPrice > 0 && (
                    <Balance
                      display="inline"
                      fontSize="24px"
                      color="white"
                      decimals={2}
                      prefix="$"
                      value={earningTokenDollarBalance}
                    />
                  )}
                </>
              ) : (
                <>
                  {/* <Heading color="textDisabled">0</Heading> */}
                  <Text fontSize="24px" color="textDisabled">
                    $0
                  </Text>
                </>
              )}
            </>
          </Flex>
        </Flex>
      </Flex>
      <ActionContent>
        {isAutoVault ? (
          <Flex flex="1.3" flexDirection="column" alignSelf="flex-start" alignItems="flex-start">
            <UnstakingFeeCountdownRow isTableVariant />
            <Flex mb="2px" justifyContent="space-between" alignItems="center">
              {tooltipVisible && tooltip}
              <TooltipText ref={targetRef} small>
                {t('Performance Fee')}
              </TooltipText>
              <Flex alignItems="center">
                <Text ml="4px" small>
                  {performanceFee / 100}%
                </Text>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Button
            style={buttonStyle}
            disabled={!hasEarnings}
            onClick={onPresentCollect}
          >
            {isCompoundPool ? t('Collect') : t('Harvest')}
          </Button>
        )}
      </ActionContent>
    </HarvestActionContainer>
  )
}

export default HarvestAction
