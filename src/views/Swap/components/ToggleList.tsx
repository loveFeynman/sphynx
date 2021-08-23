import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Text, Button, Link } from '@pancakeswap/uikit'
// eslint-disable-next-line import/no-unresolved
import './dropdown.css'
import axios from 'axios';
import {Button as materialButton,Menu,MenuItem} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const MenuWrapper = styled.div`
  padding: 0 4px;
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  width: 420px;
  border-radius: 16px;
  margin: 12px 0;
  display: flex;
  align-items: center;
  & button {
    background: transparent !important;
    outline: none;
    box-shadow: none !important;
    padding: 0 12px;
    border: none;
  }
`

const MenuTitle = styled.div`
  width: 400px;
  height: 35px;
  background: transparent;
  color: white;
  display: flex;
  align-items: center;
  padding: 0px 12px;
`

export default function ToggleList() {

  const [anchorEl, setAnchorEl] = useState(null);
  const [showDrop, setShowDrop] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const data = ["V1", "V2"];

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
    setShowDrop(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
    
  return (
    <>
      <MenuWrapper>
        <MenuTitle>
          <span>{selectedItem}</span>
        </MenuTitle>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          <ArrowDropDownIcon/>
        </Button>
        {showDrop ? <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >{data.length > 0 ?
        <span>
          {data?.map((item:any )=>{
            return <MenuItem onClick={()=> {
              setSelectedItem(item)
              setAnchorEl(null)
              console.log(selectedItem)
            }}>{item}</MenuItem>
          })}
        </span> : 
          <span style={{ padding: '0 16px' }}>no record</span>}
        </Menu>:""}
      </MenuWrapper>
    </>
  )
}

