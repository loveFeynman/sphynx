import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, useModal } from '@sphynxswap/uikit'
import DividendModal from 'components/Menu/GlobalSettings/DividendModal'
import Web3 from 'web3'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import MoreIcon from 'assets/svg/icon/MoreIcon2.svg'
import { web3Provider } from 'utils/providers'
import { useTranslation } from 'contexts/Localization'
import { FEE_WALLET } from 'config/constants'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import QuestionHelper from 'components/QuestionHelper'

const Wrapper = styled.div`
  background: black;
  border-radius: 16px;
  padding: 8px 20px;
  color: white;
  position: relative;
  & img {
    width: 48px;
  }
  & button {
    outline: none;
  }
`

const DetailsImage = styled.img`
  position: absolute;
  right: 0;
  width: auto !important;
  height: 40px;
  cursor: pointer;
`

const DividendPanel: React.FC = () => {
  const [balance, setBalance] = useState(0)
  const { t } = useTranslation()

  const [onPresentDividendModal] = useModal(<DividendModal balance={balance} />)

  useEffect(() => {
    const ac = new AbortController()
    const web3 = new Web3(web3Provider)
    const getBalance = () => {
      web3.eth.getBalance(FEE_WALLET).then((bnbBalance) => {
        let bnb: any = web3.utils.fromWei(bnbBalance)
        bnb = Number(bnb)
          .toFixed(3)
          .replace(/(\d)(?=(\d{3})+\.)/g, '$&,')
        setBalance(bnb)
        setTimeout(() => getBalance(), 60000)
      })
    }

    getBalance()

    return () => ac.abort()
  }, [])

  return (
    <Wrapper>
      <Flex>
        <img src={MainLogo} alt="Main Logo" width="159.118" height="151" />
        <Text color="white" mt={2} ml={1}>
          {t('Sphynx Swap Fee Rewards')}
        </Text>
        <DetailsImage src={MoreIcon} alt="More Icon" onClick={onPresentDividendModal} />
      </Flex>
      <RowBetween>
        <RowFixed>
          <Text fontSize="14px">
            {t('Total Transaction fees collected')}
          </Text>
        </RowFixed>
        <RowFixed>
        <QuestionHelper
              text={t(
                'Total fees will be redistributed to holders on a weekly basis. Holders must hold Sphynx Token for 7 days to be eligible for the reward. Amount distributed will be dependent on the amount of supply an investor holds.',
              )}
              ml="4px"
            />
        </RowFixed>
        <RowFixed>
          <Text fontSize="14px">{balance}BNB</Text>
        </RowFixed>
      </RowBetween>
    </Wrapper>
  )
}

export default DividendPanel
