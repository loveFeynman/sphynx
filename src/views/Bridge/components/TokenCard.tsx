import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Text, Box, Flex } from '@sphynxswap/uikit'
import { useWeb3React } from '@web3-react/core'
import BSCIcon from 'assets/svg/icon/BSCTokenIcon.svg'
import ETHIcon from 'assets/svg/icon/ETHTokenIcon.svg'

import Select from './Select'

const Container = styled.div`
  justify-content: center;
  align-items: center;
  text-align: -webkit-center;
`
const TokenLabel = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 19px;
  margin: 10px 10px 4px;
`

export default function TokenCard({ isFrom = false, networkName, chainId, handleChange }) {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  return (
    <Container>
      <Flex >
        {networkName === 'bsc' ?
          <img src={BSCIcon} width="22px" height="26px" alt="" />
          : <img src={ETHIcon} width="22px" height="26px" alt="" />}
        <Box>
          <TokenLabel>{isFrom ? `From Chain` : 'To Chain'}</TokenLabel>
          {account &&
            <Text
              fontSize="10px"
              color={(networkName === 'bsc' && chainId === 56) || (networkName === 'eth' && chainId === 1) ? 'rgb(2,192,118)' : 'rgb(0,0,0,0.4)'}
              textAlign="left"
              marginLeft="10px"
            >
              Connected
            </Text>
          }
        </Box>
      </Flex>
      <Flex justifyContent={!isFrom? 'right':''} mr={!isFrom? '10px':''} mt="20px">
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
            chainId={chainId}
          />
        )}
      </Flex>
    </Container>
  )
}
