import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components';

const CardWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 36px;
    background: #0006;
    border-radius: 8px;
    flex-flow: column;
    h1 {
        font-size: 48px;
        line-height: 72px;
        margin-bottom: 36px;
        margin-top: 36px;
    }
`

interface VauleCardProps {
    value?: string;
    desc?: string;
}

const ValueCard: React.FC<VauleCardProps> = ({value, desc}) => {
    return (
      <CardWrapper>
          <h1>{value}</h1>
          <p>{desc}</p>
      </CardWrapper>
    )
  }

export default ValueCard;