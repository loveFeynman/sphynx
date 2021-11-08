import React from 'react'
import styled from 'styled-components'
import { Box } from '@sphynxswap/uikit'
import Container from '../Layout/Container'

const Outer = styled(Box)<{ background?: string }>`
  background: rgba(0, 0, 0, 0);
  border-radius: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 16px;
    padding-bottom: 16px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 24px;
    padding-bottom: 24px;
  }
`

const Inner = styled(Container)``

const PageHeader: React.FC<{ background?: string }> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
