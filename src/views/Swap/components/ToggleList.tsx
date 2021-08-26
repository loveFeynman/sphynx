import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

// eslint-disable-next-line import/no-unresolved
import './dropdown.css'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { typeRouterVersion } from '../../../state/input/actions'

const ToggleWrapper = styled.div`
  position: relative;
  z-index: 2;
  height: 40px;
  min-width: 200px;
  flex: 1;
  border-radius: 16px;
  // margin: 12px 0;
  padding: 0 4px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 200px;
  }
  & button {
    background: transparent !important;
    outline: none;
    box-shadow: none !important;
    padding: 0 12px;
    border: none;
  }
`

const MenuWrapper = styled.div`
  position: absolute;
  width: 100%;
  background: #131313;
  color: #eee;
  top: 45px;
  overflow-y: auto;
  max-height: 100vh;
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 600px;
  }
`

const MenuTitle = styled.div`
  width: 100%;
  height: 35px;
  background: transparent;
  color: white;
  display: flex;
  align-items: center;
  padding: 0px 12px;
`

const ContractPanelOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  left: 0;
  top: 0;
`

export default function ToggleList() {

  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState('V1')
  
  const [showDrop, setShowDrop] = useState(false)

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setShowDrop(true)
  };

  const handleClose = () => {
    setAnchorEl(null)
    setShowDrop(false)
  };
    
  return (
    <ToggleWrapper>
      <Button aria-controls="fade-menu1" aria-haspopup="true" onClick={handleClick} style={{ width: '100%' }}>
        <MenuTitle>
          <span>{selectedItem}</span>
        </MenuTitle>
        <ArrowDropDownIcon style={{color: '#fff'}}/>
      </Button>
      {
        showDrop &&
        <MenuWrapper>
          <MenuItem onClick={() => {
            setSelectedItem('V1')
            dispatch(typeRouterVersion({ routerVersion: 'V1' }))
            handleClose()
          }}>V1</MenuItem>
          <MenuItem onClick={() => {
            setSelectedItem('V2')
            dispatch(typeRouterVersion({ routerVersion: 'V2' }))
            handleClose()
          }}>V2</MenuItem>
        </MenuWrapper>
      }
      { showDrop && <ContractPanelOverlay onClick={() => setShowDrop(false) } />}
    </ToggleWrapper>
  )
}

