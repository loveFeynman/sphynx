import React from 'react'
import styled from 'styled-components';

const CardWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 36px;
    background: #0006;
    border-radius: 8px;
    flex-flow: column;
    & > *:first-child {
        margin-top: 32px;
        margin-bottom: 32px;
    }
`

interface ImgCardProps {
    desc?: string;
}

const CommunityCard: React.FC<ImgCardProps> = ({ children, desc }) => {
    return (
        <CardWrapper>
            {children}
            <p>{desc}</p>
        </CardWrapper>
    )
}

export default CommunityCard;