import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Text, PancakeToggle, Toggle, Flex, Modal, InjectedModalProps, Button, Input, useModal} from '@pancakeswap/uikit'
import { useAudioModeManager, useExpertModeManager, useUserSingleHopOnly } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { useSwapActionHandlers } from 'state/swap/hooks'
import usePersistState from 'hooks/usePersistState'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'

const ApplyButton = styled(Button)`
  bottom: 16px;
  outline: none;
  background: #8B2A9B;
  &:active {
    outline: none;
  }
  &:hover {
    outline: none;
  }
  &:focus {
    outline: none;
  }
`

const ButtonWrapper = styled.div`
  background: #8B2A9B;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 12px 4px;
  border-radius: 8px;
  cursor: pointer;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: white;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
    border-radius: 10px;

  }
`
const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #372F47;
  border-radius: 16px; 
  box-shadow: inset 0px 2px 2px -1px rgba(74,74,104,0.1);
  & > input {
    &:focus {
      border: none !important;
      box-shadow: none  !important;
      border-radius:none  !important;
    }
  }
`

const Grid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: repeat(4, auto);
  margin-top: 20px;
`
const GridItem = styled.div<{ isLeft:boolean}>`
  max-width: 180px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  text-align: ${(props) => props.isLeft ? 'left' : 'right'};
  color: white;
  padding: 6px 0px;
`

const BuyTicketModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { account } = useWeb3React();
  const [manualTicketGenerate, setManualTicketGenerate] = useState(false)
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const [tickets, setTickets] = useState<string>('0');
  const [bulkDiscountPercent, setBulkDiscountPercent] = useState<string>('0');
  const [realTokens, setRealTokens ] = useState<string>('0');
  const [enabled, setEnabled] = useState(false);
  const [viewEditable, setViewEditable] = useState(false);
  const { t } = useTranslation()
  // const [onPresentManualTicketModal] = useModal(<ManualTicketInputModal onDismiss={onDismiss} ticketNums={ticketNumbers} />)

  const handleInputTokens = useCallback((event) => {
    const input = event.target.value
    if (parseInt(input) > 100)
      setTickets("100");
    else
      setTickets(input);
    const ticket = parseInt(input) > 100? 100:parseInt(input);
    if (input === '0' || input === ''){
      setBulkDiscountPercent('0');
      setRealTokens('0');
      setTicketNumbers([]);
    } else {
      setBulkDiscountPercent(((ticket-1)* 0.05).toFixed(2));
      setRealTokens((ticket / 4 * (1 - (ticket-1)* 0.0005)).toFixed(5));
      const data=[];
      for(let i=0; i < ticket; i++)  {
        data.push({id: i, ticketnumber: 0, error: false});
      }
      console.log("data" , data)
      setTicketNumbers(data);
    }
  }, [])

  const randomTickets = useCallback(() => {
    const data=[];
    // setTicketNumbers(input);
    console.log("randomtickets", ticketNumbers);
    if (ticketNumbers.length > 0 ) {
      console.log("aaaaaaaaaaaa");
      ticketNumbers.map((ticket, index)=>{
        const input = Math.floor(Math.random() * 10).toString()+
                      Math.floor(Math.random() * 10).toString() +
                      Math.floor(Math.random() * 10).toString() +
                      Math.floor(Math.random() * 10).toString() +
                      Math.floor(Math.random() * 10).toString() +
                      Math.floor(Math.random() * 10).toString() ;
        console.log("input = ", input);                      
        data.push({id: index, ticketnumber: input, error: false});
        return null;
      });
      console.log("ticketNumbers", data);
      setTicketNumbers(data);

      setViewEditable(true);
    }
    
  }, [ticketNumbers])
  
  const handleBack = useCallback(() => {
    setManualTicketGenerate(false);
  }, [])

  const handleApply= useCallback(() => {
    setManualTicketGenerate(false);
  }, [])
  return (
    <Modal
      title={t('Buy Tickets')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ minWidth: '380px',  maxWidth: '380px' }}
      onBack={manualTicketGenerate? handleBack : null}
    >
      { !manualTicketGenerate?
      (<Flex flexDirection="column">
        <Flex margin="0px 10px 0px" alignItems="center" >
          <Grid style={{marginTop: '12px'}}>
          <GridItem isLeft>
            <Text bold style={{textAlign: 'left'}} color="white" fontSize="16px">Buy Tickets</Text>
          </GridItem>
          <GridItem isLeft>
            <Text bold style={{textAlign: 'right'}} color="white" fontSize="16px">~{realTokens} SPX</Text>
          </GridItem>
        </Grid>
        </Flex>
        <InputArea> 
          <Input
            id="token-input"
            placeholder={t('0')}
            scale="lg"
            autoComplete="off"
            value={tickets}
            onChange={handleInputTokens}
            maxLength={3}
            pattern="\d*"
            required
            style={{textAlign:'right', border: 'none'}}
          />
          <Text fontSize="14px" mr="10px" style={{textAlign: 'right'}}>
            ~{tickets === '' || tickets ==='0' ?'0.00':(parseFloat(tickets)/4).toFixed(2)} SPX
          </Text>
        </InputArea> 
        <Text style={{textAlign: 'right'}} color="red" fontSize="14px" mt="8px"> Insufficient SPX balance</Text>
        <Flex justifyContent="end" marginTop="4px ">
          <Text style={{textAlign: 'right'}} color="white" fontSize="14px"> SPX Balance:</Text>
          <Text style={{textAlign: 'right'}} color="white" fontSize="14px">&nbsp;{(0).toFixed(3)}</Text>
        </Flex>
        <Flex width="100%">
          <Grid>
            <GridItem isLeft>
              <Text style={{textAlign: 'left'}} color="white" fontSize="14px">Cost (SPX)</Text>
            </GridItem>
            <GridItem isLeft={false}>
              <Text style={{textAlign: 'right'}} color="white" fontSize="14px">{tickets === '' || tickets ==='0' ?'0.00':(parseFloat(tickets)/4).toFixed(2)} SPX</Text>
            </GridItem>
            <GridItem isLeft>
              <Flex>
                <Text bold style={{textAlign: 'left'}} color="white" fontSize="14px">{bulkDiscountPercent}%</Text>
                <Text style={{textAlign: 'left'}} color="white" fontSize="14px">&nbsp; Bulk discount</Text>
              </Flex>
            </GridItem>
            <GridItem isLeft={false}>
              <Text style={{textAlign: 'right'}} color="white" fontSize="14px">~{(parseInt(tickets) / 4 * parseFloat(bulkDiscountPercent) / 100).toFixed(5)} SPX</Text>
            </GridItem>
          </Grid>
        </Flex>
        <div style={{borderTop: '1px solid', color: 'white', marginTop: '8px'}}><></></div>
        <Grid style={{marginTop: '12px'}}>
          <GridItem isLeft>
            <Text bold style={{textAlign: 'left'}} color="white" fontSize="16px">You Pay</Text>
          </GridItem>
          <GridItem isLeft>
            <Text bold style={{textAlign: 'right'}} color="white" fontSize="16px">~{realTokens} SPX</Text>
          </GridItem>
        </Grid>
        <Flex justifyContent="center" alignItems="center" marginTop="20px">
          {
            account ? 
              !enabled?
                <ApplyButton className='selected' onClick={()=>setEnabled(true)} style={{width: '100%'}}>Enable</ApplyButton>
              :
               (<Flex flexDirection= "column">
                  <ApplyButton className='selected' onClick={randomTickets} style={{width: '100%', marginBottom: '20px'}}>Buy Instantly</ApplyButton>
                  <ApplyButton className='selected' onClick={viewEditable?()=>setManualTicketGenerate(true):null} style={{width: '100%',
                    backgroundColor: viewEditable?'#8B2A9B':'grey' }}>View/Edit manual </ApplyButton>
               </Flex>) 
            :
              <ConnectWalletButton />
          }
        </Flex>
        <Flex >
          <Text fontSize='13px' color='white' mt='10px'>
            &quot;Buy Instantly&quot; chooses random numbers, with no duplicates among your tickets. Prices are set before each round starts, equal to $5 at that time. Purchases are final.
          </Text>
        </Flex>
      </Flex>
      ):(
      <Flex flexDirection="column" color="white">
        {ticketNumbers?.map((ticket, index)=>
          <Flex flexDirection="column" marginBottom="12px">
            <Text fontSize='13px' mb="8px">
              Ticket&nbsp;{ticket.id}
            </Text>
            <Input
              id={index.toString().concat("-ticket")}
              placeholder={t('0')}
              scale="lg"
              autoComplete="off"
              value={ticket.ticketnumber}
              onChange={(event)=>{
                const data = ticketNumbers;
                data[index].ticketnumber = parseInt(event.target.value);
                if (event.target.value.toString().length === 6 ) {
                  data[index].error = false;
                } else {
                  data[index].error = true;
                }
                setTicketNumbers(data);
              }}
              maxLength={6}
              pattern="\d*"
              required
              style={{textAlign:'right', border: !ticket.error?'none':'1px red'}}
            />
          </Flex>
          
        )}
        <ApplyButton className='selected' onClick={handleApply} style={{width: '100%', marginTop: '20px'}} >Apply</ApplyButton>
      </Flex>)}
    </Modal>
  )
}

export default BuyTicketModal
