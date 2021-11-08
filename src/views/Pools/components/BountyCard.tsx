import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Text,
  Flex,
  HelpIcon,
  Button,
  Heading,
  Skeleton,
  useModal,
  Box,
  useTooltip,
} from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useCakeVault } from 'state/pools/hooks'
import Balance from 'components/Balance'
import StopwatchIcon from 'assets/svg/icon/StopwatchIcon.svg'
import BountyModal from './BountyModal'

const StyledCard = styled(Card)`
  width: 100%;
  flex: 1;
  background: transparent;

  & > div > div {
    padding: 24px 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
  }
`

const LogoContent = styled(Flex)`
  align-items: center;
  margin-right: 12px;
  img {
    width: 32px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    img {
      width: 67px;
    }
  }
`

const Line = styled(Flex)`

`

const BountyCard = () => {
  const { t } = useTranslation()
  const {
    estimatedCakeBountyReward,
    fees: { callFee },
  } = useCakeVault()
  const cakePriceBusd = usePriceCakeBusd()

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyReward).multipliedBy(cakePriceBusd)
  }, [cakePriceBusd, estimatedCakeBountyReward])

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0)
  const hasFetchedCakeBounty = estimatedCakeBountyReward ? estimatedCakeBountyReward.gte(0) : false
  const dollarBountyToDisplay = hasFetchedDollarBounty ? getBalanceNumber(estimatedDollarBountyReward, 18) : 0
  const cakeBountyToDisplay = hasFetchedCakeBounty ? getBalanceNumber(estimatedCakeBountyReward, 18) : 0

  const TooltipComponent = ({ fee }: { fee: number }) => (
    <>
      <Text color="#452a7a" mb="16px">{t('This bounty is given as a reward for providing a service to other users.')}</Text>
      <Text color="#452a7a" mb="16px">
        {t(
          'Whenever you successfully claim the bounty, you’re also helping out by activating the Auto SPHYNX Pool’s compounding function for everyone.',
        )}
      </Text>
      <Text color="#452a7a" style={{ fontWeight: 'bold' }}>
        {t('Auto-Compound Bounty: %fee%% of all Auto SPHYNX pool users pending yield', { fee: fee / 100 })}
      </Text>
    </>
  )

  const [onPresentBountyModal] = useModal(<BountyModal TooltipComponent={TooltipComponent} />)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent fee={callFee} />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard background="transparent">
        <CardBody>
          <Flex flexDirection="row">
            <Flex flexGrow={1} style={{ borderRight: '1px solid #21214A' }}>
              <LogoContent>
                <img src={StopwatchIcon} alt="Stopwatch Logo" width="100%" />
                <Flex flexDirection="column" style={{ padding: '12px 0px' }}>
                  <Flex alignItems="center" mb="2px">
                    <Text fontSize="20px" bold color="white" mr="4px">
                      {t('Auto SPHYNX Bounty')}
                    </Text>
                    <Box ref={targetRef}>
                      <HelpIcon color="white" />
                    </Box>
                  </Flex>
                  <Flex flexDirection="column" mr="12px">
                    <Heading>
                      {hasFetchedCakeBounty ? (
                        <Balance fontSize="15px" color="#777777" value={cakeBountyToDisplay} decimals={3} />
                      ) : (
                        <Skeleton height={20} width={96} mb="2px" />
                      )}
                    </Heading>
                  </Flex>
                </Flex>
              </LogoContent>
            </Flex>
            <Flex flexGrow={1} alignItems="center" justifyContent="end">
              <Button
                variant="primary"
                disabled={!dollarBountyToDisplay || !cakeBountyToDisplay || !callFee}
                onClick={onPresentBountyModal}
                scale="sm"
                id="clickClaimVaultBounty"
                style={{ color: "white", backgroundColor: '#2E2E55', borderColor: '#2E2E55', borderRadius: '5px' }}
              >
                {t('Claim')}
              </Button>
            </Flex>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default BountyCard
