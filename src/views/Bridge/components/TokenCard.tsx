import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Text } from '@sphynxswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as BSCIcon } from 'assets/svg/icon/BSCTokenIcon.svg'
import { ReactComponent as ETHIcon } from 'assets/svg/icon/ETHTokenIcon.svg'

import Select from './Select'

const Container = styled.div`
  justify-content: center;
  align-items: center;
  text-align: -webkit-center;
`
const TokenLabel = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 19px;
  margin: 20px;
`

export default function TokenCard({ isFrom = false, networkName, chainId, handleChange }) {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  
  return (
    <Container>
      <TokenLabel>{isFrom ? `From Chain` : 'To Chain'}</TokenLabel>
      {networkName === 'bsc' ? <BSCIcon /> : <ETHIcon />}
      {account &&
        <Text
          fontSize="10px"
          color={(networkName === 'bsc' && chainId === 56) || (networkName === 'eth' && chainId === 1) ? 'rgb(2,192,118)' : 'rgb(0,0,0,0.4)'}
        >
          Connected
        </Text>
      }
      {!((networkName === 'bsc' && chainId === 56) || (networkName === 'eth' && chainId === 1)) && (
        <Select
          options={[
            {
              label: t('BSC'),
              value: 'bsc',
            },
            {
              label: t('ETH'),
              value: 'eth',
            }
          ]}
          network={networkName}
          onChange={handleChange}
          chainId = {chainId}
        />
      )
      }

    </Container>
  )
}
