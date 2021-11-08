import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ReactComponent as MainLogo } from 'assets/svg/icon/logo_new.svg'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: white;
  margin-top: 24px;
  p {
    line-height: 24px;
  }
`

const LogoTitle = styled.h2`
  font-size: 36px;
  line-height: 42px;
`

const Launchpad: React.FC = () => {
  return (
    <Wrapper>
      <MainLogo />
      <p>Welcome to sphynx!</p>
      <br />
      <LogoTitle>BINANCE CHAIN DECENTRALIZED</LogoTitle>
      <LogoTitle>PROTOCOLS & SERVICES</LogoTitle>
      <br />
      <p>Sphynx helps everyone to create their own tokens and token sales in few seconds.</p>
      <p>Tokens created on Sphynx willbe verified and published on explorer websites.</p>
    </Wrapper>
  )
}

export default Launchpad
