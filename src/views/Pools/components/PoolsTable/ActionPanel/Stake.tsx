import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, useModal, IconButton, AddIcon, MinusIcon, Skeleton, useTooltip, Flex, Text, useMatchBreakpoints } from '@sphynxswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useWeb3React } from '@web3-react/core'
import { useCakeVault } from 'state/pools/hooks'
import { Pool } from 'state/types'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { PoolCategory } from 'config/constants/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { getAddress } from 'utils/addressHelpers'
import { useERC20 } from 'hooks/useContract'
import { convertSharesToCake } from 'views/Pools/helpers'
import { ActionContainer, StakeActionTitles, ActionContent } from './styles'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import StakeModal from '../../PoolCard/Modals/StakeModal'
import VaultStakeModal from '../../CakeVaultCard/VaultStakeModal'
import { useCheckVaultApprovalStatus, useApprovePool, useVaultApprove } from '../../../hooks/useApprove'

const IconButtonWrapper = styled.div`
  display: flex;
`

const ColorButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  color: white;
  font-size: 13px;
  background: linear-gradient(90deg,#610D89 0%,#C42BB4 100%);
  width: 102px;
  outline: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 176px;
  }
`
const ButtonSkeleton = styled(Skeleton)`
  width: 102px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 176px;
  }
`

const StackedFlex = styled(Flex)`
  flex: 1;
  flex-direction: row;
  margin-bottom: 10px;
  margin-right: 0px;
  -webkit-box-align: end;
  -webkit-flex-align: end;
  -ms-flex-align: end;
  -webkit-align-items: end;
  align-items: end;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0px;
    margin-right: 10px;
  }
`

const StackedActionContent = styled(ActionContent)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const AddIconButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  border-radius: 9px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 48px;
    height: 48px;
    border-radius: 16px;
  }
`

interface StackedActionProps {
  pool: Pool
  userDataLoaded: boolean
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ pool, userDataLoaded }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    stakingLimit,
    isFinished,
    poolCategory,
    userData,
    stakingTokenPrice,
    isAutoVault,
  } = pool
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const { handleApprove: handlePoolApprove, requestedApproval: requestedPoolApproval } = useApprovePool(
    stakingTokenContract,
    sousId,
    earningToken.symbol,
  )

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus()
  const { handleApprove: handleVaultApprove, requestedApproval: requestedVaultApproval } =
    useVaultApprove(setLastUpdated)

  const handleApprove = isAutoVault ? handleVaultApprove : handlePoolApprove
  const requestedApproval = isAutoVault ? requestedVaultApproval : requestedPoolApproval

  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isNotVaultAndHasStake = !isAutoVault && stakedBalance.gt(0)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const {
    userData: { userShares },
    pricePerFullShare,
  } = useCakeVault()

  const { cakeAsBigNumber, cakeAsNumberBalance } = convertSharesToCake(userShares, pricePerFullShare)
  const hasSharesStaked = userShares && userShares.gt(0)
  const isVaultWithShares = isAutoVault && hasSharesStaked
  const stakedAutoDollarValue = getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)

  const needsApproval = isAutoVault ? !isVaultApproved : !allowance.gt(0) && !isBnbPool

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [onPresentVaultStake] = useModal(<VaultStakeModal stakingMax={stakingTokenBalance} pool={pool} />)

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const [onPresentVaultUnstake] = useModal(<VaultStakeModal stakingMax={cakeAsBigNumber} pool={pool} isRemovingStake />)

  const onStake = () => {
    if (isAutoVault) {
      onPresentVaultStake()
    } else {
      onPresentStake()
    }
  }

  const onUnstake = () => {
    if (isAutoVault) {
      onPresentVaultUnstake()
    } else {
      onPresentUnstake()
    }
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("You've already staked the maximum amount you can stake in this pool!"),
    { placement: 'bottom' },
  )

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  if (!account) {
    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text fontSize="12px" bold color="#A7A7CC" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ConnectWalletButton />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text fontSize="12px" bold color="#A7A7CC" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ButtonSkeleton height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (needsApproval) {
    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text fontSize="12px" bold color="#A7A7CC" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ColorButton onClick={handleApprove} variant="secondary">
            {t('Enable')}
          </ColorButton>
        </ActionContent>
      </ActionContainer>
    )
  }

  // Wallet connected, user data loaded and approved
  if (isNotVaultAndHasStake || isVaultWithShares) {
    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text fontSize="12px" bold color="#A7A7CC" as="span" textTransform="uppercase">
            {stakingToken.symbol}{' '}
          </Text>
          <Text fontSize="12px" bold color="#A7A7CC" as="span" textTransform="uppercase">
            {isAutoVault ? t('Staked (compounding)') : t('Staked')}
          </Text>
        </StakeActionTitles>
        <StackedActionContent>
          <StackedFlex>
            <Balance
              lineHeight="1"
              bold
              fontSize={isMobile? "12px": "16px"}
              decimals={5}
              value={isAutoVault ? cakeAsNumberBalance : stakedTokenBalance}
            />
            {/* <Balance
              fontSize={isMobile? "12px": "16px"}
              display="inline"
              color="textSubtle"
              decimals={2}
              value={isAutoVault ? stakedAutoDollarValue : stakedTokenDollarBalance}
              unit=" USD"
              prefix="~"
            /> */}
          </StackedFlex>
          <IconButtonWrapper>
            <AddIconButton variant="secondary" onClick={onUnstake} mr="6px">
              <MinusIcon color="primary" width="14px" />
            </AddIconButton>
            {reachStakingLimit ? (
              <span ref={targetRef}>
                <AddIconButton variant="secondary" disabled>
                  <AddIcon color="textDisabled" width="24px" height="24px" />
                </AddIconButton>
              </span>
            ) : (
              <AddIconButton
                variant="secondary"
                onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
                disabled={isFinished}
              >
                <AddIcon color="primary" width="14px" />
              </AddIconButton>
            )}
          </IconButtonWrapper>
          {tooltipVisible && tooltip}
        </StackedActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <StakeActionTitles>
        <Text fontSize="12px" bold color="#A7A7CC" as="span" textTransform="uppercase">
          {t('Stake')}{' '}
        </Text>
        <Text fontSize="12px" bold color="#A7A7CC" as="span" textTransform="uppercase">
          {stakingToken.symbol}
        </Text>
      </StakeActionTitles>
      <ActionContent>
        <ColorButton
          onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
          variant="secondary"
          disabled={isFinished}
        >
          {t('Stake')}
        </ColorButton>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
