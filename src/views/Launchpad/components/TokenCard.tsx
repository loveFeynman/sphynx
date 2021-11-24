import React from 'react'
import styled from 'styled-components'
import { Text } from '@sphynxswap/uikit';
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import TimerComponent from 'components/Timer/TimerComponent'
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

const CardFooter = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    padding-bottom: 37px;
    div:last-child {
        text-align: center;
        font-size: 14px;
        color: #A7A7CC;
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
    display: flex;
    justify-content: center;
    font-size: 9px;
    font-weight: bold;

`

const SaleInfo = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    // padding: 0px 24px; 
`

const SaleInfoTitle = styled.div`
    color: #A7A7CC;
    font-weight: 600;
    font-size: 14px;
`

const SaleInfoValue = styled.div`
    color: #F2C94C;
    font-weight: 600;
    font-size: 14px;
`

const Divider = styled.div`
    height: 1px;
    background: #21214A;
    margin: 16px 0px;
`
const SaleInfoWrapper = styled.div`
    padding: 24px 0px;
    width: calc(100% - 42px);
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
    saleId: number;
    ownerAddress: string;
    tokenSymbole?: string;
    tokenName?: string;
    tokenLogo?: string;
    activeSale?: number;
    totalCap?: number;
    softCap?: number;
    hardCap?: number;
    minContribution?: number;
    maxContribution?: number;
    endTime?: string;
    tokenState?: string;    
}

const TokenCard: React.FC<ImgCardProps> = ({ saleId, ownerAddress, tokenSymbole, tokenName, tokenLogo, activeSale, softCap, hardCap, totalCap, minContribution, maxContribution, endTime, tokenState }: ImgCardProps) => {
    const history = useHistory()
    const { account } = useWeb3React()

    const handleClicked = () => {
        if(account === ownerAddress){
            history.push(`/launchpad/presale/${saleId}`)
        }
        else {
            history.push(`/launchpad/live/${saleId}`)
        }
    }

    return (
        <CardWrapper onClick={handleClicked}>
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
                    <TimerComponent time={endTime}/>
                </EndTimeWrapper>
            </CardHeader>
            <CardBody>
                <ActiveSaleText state={tokenState}>
                    {`${tokenState} Sale`}
                </ActiveSaleText>
                <ProgressBarWrapper>
                    <ProgressBar>
                        <Progress state={activeSale}>
                            {(activeSale).toFixed(2)}%
                        </Progress>
                    </ProgressBar>
                </ProgressBarWrapper>
                <SaleInfoWrapper>
                    <SaleInfo>
                        <SaleInfoTitle>
                            Raised:
                        </SaleInfoTitle>
                        <SaleInfoValue>
                            {totalCap}/{hardCap}
                        </SaleInfoValue>
                    </SaleInfo>
                    <Divider/>
                    <SaleInfo>
                        <SaleInfoTitle>
                            Soft Cap / Hard Cap:
                        </SaleInfoTitle>
                        <SaleInfoValue>
                            {softCap}/{hardCap} BNB
                        </SaleInfoValue>
                    </SaleInfo>
                    <Divider/>
                    <SaleInfo>
                        <SaleInfoTitle>
                            Min/Max Contribution:
                        </SaleInfoTitle>
                        <SaleInfoValue>
                            {minContribution}/{maxContribution} BNB
                        </SaleInfoValue>
                    </SaleInfo>
                    <Divider/>
                </SaleInfoWrapper>
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