import React, { useEffect, useState } from 'react'
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBody,
  InjectedModalProps,
  Heading,
  Text,
  Checkbox,
  Button,
  Link,
} from '@sphynxswap/uikit'
// import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { TERMS_LIST } from './config'

const StyledModalContainer = styled(ModalContainer)`
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 420px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 900px;
  }
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 26px;
`

const TermRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`

const ButtonRow = styled.div`
  display: flex;
  margin-top: 20px;
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const CheckGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

interface DisclaimerModalProps extends InjectedModalProps {
  // setModalShow: (disclaimerModalShow: boolean) => void
  modalState?: true,
}

export default function DisclaimerModal({ onDismiss = () => null, modalState }: DisclaimerModalProps) {
  const dispatch = useDispatch()
  // const history = useHistory()

  const checkedArrayLen = 10
  const [arrayCheckedState, setArrayCheckedState] = useState([])
  const [tested, setTested] = useState(false)

  const handleChangeCheckbox = (index: number) => {
    const arr = [...arrayCheckedState]

    if (arr.indexOf(index) > -1) {
      arr.splice(arr.indexOf(index), 1)
      if (index === checkedArrayLen - 1) {
        setArrayCheckedState([])
        return
      }
    } else {
      arr.push(index)
      if (index === checkedArrayLen - 1) {
        for (let i = 0; i < checkedArrayLen; i++) {
          if (arr.indexOf(i) < 0) {
            arr.push(i)
          }
        }
      } else if (arr.length === checkedArrayLen - 1) {
        arr.push(checkedArrayLen - 1)
      }
    }

    setArrayCheckedState(arr)
  }

  const handleConfirm = () => {
    onDismiss()
  }

  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          <Heading>Disclaimer</Heading>
        </ModalTitle>
      </ModalHeader>
      <StyledModalBody>
        <Text fontSize="14px">Please read the Terms and Conditions then agree to all the following to proceed!</Text>
        <CheckGroup>
          {TERMS_LIST.map((item, index) => (
            <TermRow key={item.id}>
              <Checkbox
                type="checkbox"
                key={item.id}
                checked={(arrayCheckedState.indexOf(index) > -1) as boolean}
                onClick={() => handleChangeCheckbox(index)}
              />
              <Text fontSize="12px">{item.text}</Text>
            </TermRow>
          ))}
        </CheckGroup>
        <ButtonRow>
          <ButtonWrapper>
            <Link href="/launchpad">
              <Button style={{borderRadius: "5px"}}>CANCEL</Button>
            </Link>
          </ButtonWrapper>
          <ButtonWrapper>
            <Button  style={{borderRadius: "5px"}} onClick={handleConfirm} disabled={arrayCheckedState.length !== checkedArrayLen}>
              CONFIRM
            </Button>
          </ButtonWrapper>
        </ButtonRow>
      </StyledModalBody>
    </StyledModalContainer>
  )
}
