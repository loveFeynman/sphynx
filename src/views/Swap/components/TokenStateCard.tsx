import React, { useEffect, useState, useRef, useCallback } from 'react'
import Column from 'components/Column'
import styled from 'styled-components'
import { Flex, Text } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import DefaultImg from 'assets/images/MainLogo.png'

interface TokenStateProps {
  tokenImg?: string;
  cardTitle?: string;
  cardValue?: string;
  subPriceValue?: string;
  variantFill?: boolean;
  valueActive?: boolean;
  flexGrow?: number;
}

const TokenTitleCard = styled(Column)<{variantFill, flexGrow}>`
  background: ${({ variantFill }) => (variantFill ? 'linear-gradient(90deg, #610D89 0%, #C42BB4 100%)' : '')};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: ${({ flexGrow }) => flexGrow};
  height: 91px;
`

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  height: ${({ size }) => (size ? `${size}px` : '32px')};
  width: ${({ size }) => (size ? `${size}px` : '32px')};
  span {
    height: ${({ size }) => (size ? `${size}px` : '32px')};
    width: ${({ size }) => (size ? `${size}px` : '32px')};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: flex-end;
  }
`

const TokenDescription = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  div:nth-child(2) {
    width: 100%; 
  }
  div:nth-child(3) {
    width: 100%;
  }
`

export default function TokenStateCard(props: TokenStateProps) {

  const { tokenImg, cardTitle, cardValue, subPriceValue, variantFill, valueActive, flexGrow } = props
  const { t } = useTranslation()

  const onImgLoadError = (event: any) => {
    const elem = event.target
    elem.src = DefaultImg
  }

  return (
    <TokenTitleCard variantFill={variantFill} flexGrow={flexGrow}>
      <Flex>
        {tokenImg !== undefined?
          <IconWrapper size={60}>
            <img src={tokenImg} width="32" height="32" onError={onImgLoadError} alt="No icon yet" />
          </IconWrapper>
        : ''
        }
        <TokenDescription style={{width: "100%"}}>
          <Text textAlign={tokenImg === undefined? "center": "unset"} color={tokenImg === undefined? "#A7A7CC": "white"} fontSize="12px" bold>{t(`${cardTitle}`)}</Text>
          <Text textAlign={tokenImg === undefined? "center": "unset"} fontSize="16px" bold color={valueActive? "limegreen": "white"}>{cardValue}</Text>
          <Text  textAlign={tokenImg === undefined? "center": "unset"} fontSize="16px" bold color="limegreen">{subPriceValue}</Text>
        </TokenDescription>
      </Flex>
    </TokenTitleCard>
  )
}
