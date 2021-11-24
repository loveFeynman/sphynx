import React from 'react'
import { useTooltip, Box, BoxProps } from '@sphynxswap/uikit'
import styled from 'styled-components'
import NuclearIcon from 'assets/svg/icon/NuclearIcon.svg'
import GearIcon from 'assets/svg/icon/GearIcon.svg'

interface Props extends BoxProps {
  text: string | React.ReactNode
}

const ImageWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`

const ContractHelper: React.FC<Props> = ({ text, ...props }) => {
  const { width } = window.screen;
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement: width > 768 ? 'top-start' : 'top-end', trigger: 'hover' })

  return (
    <Box {...props}>
      {tooltipVisible && tooltip}
      <ImageWrapper ref={targetRef}>
        <img src={GearIcon} alt="nuclear icon" />
      </ImageWrapper>
    </Box>
  )
}

export default ContractHelper
