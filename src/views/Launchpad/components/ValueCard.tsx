import React from 'react'
import styled from 'styled-components';
import {  Flex } from '@sphynxswap/uikit'

const CardWrapper = styled.div<{color: string}>`
    display: flex;
    align-items: center;
    width: 24%;
    padding: 17px 24px;
    background: ${ ({color}) => color };
    border-radius: 5px;
    border: 1px solid #5E2B60;
    flex-flow: row;
    h1 {
        font-size: 20px;
    }
    p {
        font-size: 12px;
    }
`

interface VauleCardProps {
    value?: string;
    desc?: string;
    color?: string;
}

const ValueCard: React.FC<VauleCardProps> = ({ children, value, desc, color="transparent" }) => {
    return (
        <CardWrapper color={color}>
            {children}
            <Flex flexDirection='column' alignItems='start' ml='25px'>
                <h1>{value}</h1>
                <p>{desc}</p>
            </Flex>
        </CardWrapper>
    )
}

export default ValueCard;