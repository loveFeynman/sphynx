import React from 'react'
import styled from 'styled-components'
import { Text } from '@sphynxswap/uikit';
import ContractHelper from './ContractHelper';

const CardWrapper = styled.div`
    background: ${({ theme }) => (theme.isDark ? "#040413" : "#2A2E60")};
    border-radius: 8px;
`

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 24px;
    gap: 16px;
`

const TokenSymbolWrapper = styled.div`
    div:first-child {
        font-weight: bold;
        font-size: 20px;
        text-transform: capitalize;
    }
    div:last-child {
        font-weight: 600;
        font-size: 14px;
        white-space: nowrap;
        color: #A7A7CC;
        text-transform: capitalize;
    }
`

const EndTimeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    align-items: flex-end;
    div:first-child {
        font-weight: 600;
        font-size: 13px;
        white-space: nowrap;
        color: #F2C94C;
    }
    div:last-child {
        font-weight: 600;
        font-size: 11px;
        white-space: nowrap;
        color: #A7A7CC;
    }
`

const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const RaisedRow = styled.div`
    margin-top: 30px;
    div {
        color: #37AEE2;
        text-align: center;
        font-weight: 500;
        font-size: 16px;
    }
`

const CapRate = styled.div`
    margin-top: 8px;
    div {
        color: white;
        text-align: center;
        font-weight: 500;
        font-size: 14px;
    }
`

const ContributionRate = styled.div`
    margin-top: 8px;
    div {
        color: white;
        text-align: center;
        font-weight: 500;
        font-size: 14px;
    }
`

const CardFooter = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 37px;
    div:last-child {
        text-align: center;
        font-weight: 600;
        font-size: 12px;
    }
`

const ActiveSaleText = styled.span<{state}>`
    color: ${(props) => (props.state === "active" ? "#00AC1C" : props.state === "pending"? "#FFC700" : "#D91A00")};
    text-transform: uppercase;
    font-weight: 600;
    font-size: 10px;
    letter-spacing: 0.2em;
`

const ProgressBarWrapper = styled.div`
    width: 100%;
`

const ProgressBar = styled.div`
    margin: 8px 24px;
    background-color: #23234B;
    border-radius: 8px;
    position: relative;
`

const Progress = styled.div<{state}>`
    width: ${props => `${props.state}%`};
    height: 12px;
    background: linear-gradient(90deg, #610D89 0%, #C42BB4 100%);
    border-radius: 8px 0px 0px 8px;
    padding: 1px;
`

const ProgressText = styled.div`
    font-size: 9px;
    font-weight: bold;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: fit-content;
    height: fit-content;
    position: absolute;
`

const TokenImg = styled.div`
    img {
        width: 64px;
        height: 64px;
        max-width: unset;
    }
`

const TokenWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10px;
    flex: 2;
`

interface ImgCardProps {
    tokenSymbole?: string;
    tokenName?: string;
    tokenLogo?: string;
    activeSale?: number;
    softCap?: number;
    hardCap?: number;
    minContribution?: number;
    maxContribution?: number;
    tokenState?: string;    
}

const TokenCard: React.FC<ImgCardProps> = ({ tokenSymbole, tokenName, tokenLogo, activeSale, softCap, hardCap, minContribution, maxContribution, tokenState }: ImgCardProps) => {
    return (
        <CardWrapper>
            <CardHeader>
                <TokenWrapper>
                    <TokenImg>
                        <img src={tokenLogo} alt="token icon"/>
                    </TokenImg>
                    <TokenSymbolWrapper>
                        <Text>{tokenSymbole}</Text>
                        <Text>{tokenName}</Text>
                    </TokenSymbolWrapper>
                </TokenWrapper>
                <EndTimeWrapper>
                    <Text>Sale end in:</Text>
                    <Text>06:23:49:16</Text>
                </EndTimeWrapper>
            </CardHeader>
            <CardBody>
                <ActiveSaleText state={tokenState}>
                    {`${tokenState} Sale`}
                </ActiveSaleText>
                <ProgressBarWrapper>
                    <ProgressBar>
                        <Progress state={activeSale}/>
                        <ProgressText>
                            {activeSale}%
                        </ProgressText>
                    </ProgressBar>
                </ProgressBarWrapper>
                <RaisedRow>
                    <Text>
                        Raised: 0.00/300
                    </Text>
                </RaisedRow>
                <CapRate>
                    <Text>Soft Cap/Hard Cap: {softCap}/{hardCap} BNB</Text>
                </CapRate>
                <ContributionRate>
                    <Text>Min/Max contribution: {minContribution}/{maxContribution} BNB</Text>
                </ContributionRate>
            </CardBody>
            <CardFooter>
                <ContractHelper
                    text="Tokens can be clones and can have the same name as existing coins. Token creators can pretend to be owners of the real project. Please use provided social links to research and examine every project to avoid scams."
                />
                <Text>Custom Contract</Text>
            </CardFooter>
        </CardWrapper>
    )
}

export default TokenCard;