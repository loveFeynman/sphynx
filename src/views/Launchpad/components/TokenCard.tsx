import React from 'react'
import styled from 'styled-components'
import { Text } from '@sphynxswap/uikit';
import Progress from '@delowar/react-circle-progressbar';
import ContractHelper from './ContractHelper';

const CardWrapper = styled.div`
    background: ${({ theme }) => (theme.isDark ? "#040413" : "#2A2E60")};
    border-radius: 8px;
`

const CardHeader = styled.div`
    display: flex;
    padding: 24px;
    gap: 16px;
`

const TokenSymbolWrapper = styled.div`
    div:first-child {
        font-weight: bold;
        font-size: 18px;
    }
    div:last-child {
        font-weight: normal;
        font-size: 16px;
        white-space: nowrap;
    }
`

const EndTimeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    align-items: flex-start;
    div {
        font-weight: 600;
        font-size: 12px;
        white-space: nowrap;
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

const ProgressbarWrapper = styled.div`
    // width: 125px;
`

const ActiveSale = styled.div<{state}>`
    background-color: ${(props) => (props.state === "active" ? "#00AC1C" : props.state === "pending"? "#FFC700" : "#D91A00")};
    width: 45px;
    height: 19px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
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
                    <Text>Sale ends in:</Text>
                    <Text>06:23:49:16</Text>
                </EndTimeWrapper>
            </CardHeader>
            <CardBody>
                <ProgressbarWrapper>
                    <Progress size={140} fillColor="#8B2A9B" borderWidth="14" borderBgWidth="13" percent={activeSale}>
                        <ActiveSale state={tokenState}>
                            <Text fontSize="7px" textTransform="capitalize">
                                {`${tokenState} Sale`}
                            </Text>
                        </ActiveSale>
                        <Text fontSize="24px">{activeSale}%</Text>
                    </Progress>
                </ProgressbarWrapper>
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