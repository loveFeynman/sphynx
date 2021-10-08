import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, useModal } from '@sphynxswap/uikit'
import DividendModal from 'components/Menu/GlobalSettings/DividendModal'
import axios from 'axios'
import Web3 from 'web3'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import MoreIcon from 'assets/svg/icon/MoreIcon2.svg'
import { WEBSOCKET_URL } from 'utils/providers'
import { useTranslation } from 'contexts/Localization'
import tokenABI from '../../../assets/abis/erc20.json'

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
  const [price, setPrice] = useState(0)
  const { t } = useTranslation()

  const [onPresentDividendModal] = useModal(<DividendModal balance={balance * price} />)

  useEffect(() => {
    const ac = new AbortController();
    axios.get('https://thesphynx.co/api/price/0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c').then(({ data }) => {
      setPrice(data.price)
    })
    const providerURL = WEBSOCKET_URL
    const web3 = new Web3(new Web3.providers.HttpProvider(providerURL))
    const abi: any = tokenABI
    const tokenContract = new web3.eth.Contract(abi, '0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c')
    tokenContract.methods
      .balanceOf('0x795BAb595218150833bc4bBc96541D37Ed7658cf')
      .call()
      .then((data) => {
        const bal: any = web3.utils.fromWei(data)
        setBalance(bal / 2)
      })

    return () => ac.abort();
  }, [])

  return (
    <Wrapper>
      <Flex>
        <img src={MainLogo} alt="Main Logo" />
        <Text color="white" mt={2} ml={1}>
          {t('Sphynx Dividend')}
        </Text>
        <DetailsImage src={MoreIcon} alt="More Icon" onClick={() => onPresentDividendModal()} />
      </Flex>
      <Flex justifyContent="space-between" mt={2}>
        <Text color="white" fontSize="14px">
          {t('Amount to be Distributed')}
        </Text>
        <Text color="white" fontSize="14px">
          $ {balance * price}
        </Text>
      </Flex>
    </Wrapper>
  )
}

export default DividendPanel
