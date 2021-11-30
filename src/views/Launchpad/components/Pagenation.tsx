import React from 'react'
import styled from 'styled-components'
import { Button, Text } from '@sphynxdex/uikit';
import { ReactComponent as ArrowLeftIcon} from 'assets/svg/icon/ArrowLeftIcon.svg'
import { ReactComponent as ArrowRightIcon} from 'assets/svg/icon/ArrowRightIcon.svg'

const PagenationWrapper = styled.div`
    margin-top: 68px;
    width: 100%;
    display: flex;
    justify-content: center;
`

const PagenationContainer = styled.div`
    display: flex;
    width: 340px;
    justify-content: space-between;
    padding: 10px;
    border-top: 1px solid #E4E7EC;
`

const PageNumber = styled.div`
    display: flex;
    align-items: center;
`

const Pagenation = ({ pageCount }) => {

    return (
        <PagenationWrapper>
            <PagenationContainer>
                <Button style={{padding: '0 18px'}}>
                    <ArrowLeftIcon />
                </Button>
                <PageNumber>
                    <Text color="white" fontSize="14px">Page 1 of {pageCount}</Text>
                </PageNumber>
                <Button style={{padding: '0 18px'}}>
                    <ArrowRightIcon />
                </Button>
            </PagenationContainer>
        </PagenationWrapper>
    )
}

export default Pagenation;