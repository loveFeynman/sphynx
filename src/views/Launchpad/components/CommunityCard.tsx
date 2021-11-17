import React from 'react'
import styled from 'styled-components';
import { Text } from '@sphynxswap/uikit'

const CardWrapper = styled.div`
    display: flex;
    width: 24%;
    justify-content: space-between;
    align-items: center;
    padding: 36px;
    background:  ${({ theme }) => theme.isDark ? '#1A1A3A' : '#191C41'};
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border-radius: 10px;
    flex-flow: column;
    & > *:first-child {
        margin-bottom: 12px;
    }
`

interface ImgCardProps {
    desc?: string;
}

const CommunityCard: React.FC<ImgCardProps> = ({ children, desc }) => {
    return (
        <CardWrapper>
            {children}
            <Text fontSize='16px' color='white'>{desc}</Text>
        </CardWrapper>
    )
}

export default CommunityCard;