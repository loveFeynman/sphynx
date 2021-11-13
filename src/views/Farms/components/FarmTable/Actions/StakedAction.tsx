import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, useModal, IconButton, AddIcon, MinusIcon, Skeleton, Text, Heading, Flex, useMatchBreakpoints } from '@sphynxswap/uikit'
import { useLocation } from 'react-router-dom'
import { BigNumber } from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Balance from 'components/Balance'
import { useWeb3React } from '@web3-react/core'
import { useFarmUser, useLpTokenPrice } from 'state/farms/hooks'
import { fetchFarmUserDataAsync } from 'state/farms'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { BASE_SWAP_URL } from 'config'
import { useAppDispatch } from 'state'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'
import DepositModal from '../../DepositModal'
import WithdrawModal from '../../WithdrawModal'
import useStakeFarms from '../../../hooks/useStakeFarms'
import useApproveFarm from '../../../hooks/useApproveFarm'
import { ActionContainer, StakeActionTitles, ActionTitles, ActionContent } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`

const ColorButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: linear-gradient(90deg,#610D89 0%,#C42BB4 100%);
  width: 102px;
  outline: 'none';
  color: white;

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

const StackedFlex = styled(Flex)`
  flex: 1;
  flex-direction: row;
  margin-bottom: 10px;
  margin-right: 0px;
  align-items: self-end;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0px;
    margin-right: 10px;
  }
`

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean
}

const Staked: React.FunctionComponent<StackedActionProps> = ({
  pid,
  lpSymbol,
  lpAddresses,
  userDataReady,
}) => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { account } = useWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid)
  const { onStake } = useStakeFarms(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  const location = useLocation()
  const lpPrice = useLpTokenPrice(lpSymbol)

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpAddress = getAddress(lpAddresses)
  const addLiquidityUrl = `${BASE_SWAP_URL}`
  const dispatch = useAppDispatch()

  const handleStake = async (amount: string) => {
    await onStake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
      return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN)
    }
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={handleStake} tokenName={lpSymbol} addLiquidityUrl={addLiquidityUrl} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} />,
  )
  const lpContract = useERC20(lpAddress)
  const { onApprove } = useApproveFarm(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))

      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account, pid])

  if (!account) {
    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text bold textTransform="uppercase" color="#A7A7CC" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (isApproved) {
    if (stakedBalance.gt(0)) {
      return (
        <ActionContainer>
          <StakeActionTitles>
            <Text bold textTransform="uppercase" color="#A7A7CC" fontSize="12px" pr="4px">
              {lpSymbol}
            </Text>
            <Text bold textTransform="uppercase" color="#A7A7CC" fontSize="12px">
              {t('Staked')}
            </Text>
          </StakeActionTitles>
          <ActionContent>
            <StackedFlex>
              <Text fontSize={isMobile? "12px": "16px"}>{displayBalance()}</Text>
              {/* {stakedBalance.gt(0) && lpPrice.gt(0) && (
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={2}
                  value={getBalanceNumber(lpPrice.times(stakedBalance))}
                  unit=" USD"
                  prefix="~"
                />
              )} */}
            </StackedFlex>
            <IconButtonWrapper>
              <AddIconButton variant="secondary" onClick={onPresentWithdraw} mr="6px">
                <MinusIcon color="primary" width="14px" />
              </AddIconButton>
              <AddIconButton
                variant="secondary"
                onClick={onPresentDeposit}
                disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
              >
                <AddIcon color="primary" width="14px" />
              </AddIconButton>
            </IconButtonWrapper>
          </ActionContent>
        </ActionContainer>
      )
    }

    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text bold textTransform="uppercase" color="#A7A7CC" fontSize="12px" pr="4px">
            {t('Stake').toUpperCase()}
          </Text>
          <Text bold textTransform="uppercase" color="#A7A7CC" fontSize="12px">
            {lpSymbol}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ColorButton
            width="100%"
            onClick={onPresentDeposit}
            variant="secondary"
            disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
          >
            {t('Stake LP')}
          </ColorButton>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataReady) {
    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text bold textTransform="uppercase" color="#A7A7CC" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ButtonSkeleton height="32px" />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <StakeActionTitles>
        <Text bold textTransform="uppercase" color="#A7A7CC" fontSize="12px">
          {t('Enable Farm')}
        </Text>
      </StakeActionTitles>
      <ActionContent>
        <ColorButton width="100%" disabled={requestedApproval} onClick={handleApprove} variant="secondary">
          {t('Enable')}
        </ColorButton>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
