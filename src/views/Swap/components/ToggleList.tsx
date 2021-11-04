import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { ChainId } from '@sphynxswap/sdk'
import { PoolData } from 'state/info/types'
import { ToggleMenuItem, RouterTypeToggle } from 'config/constants/types'
import './dropdown.css'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { AppState } from '../../../state'
import { typeRouterVersion } from '../../../state/input/actions'
import { isAddress } from '../../../utils'

const ToggleWrapper = styled.div`
  position: relative;
  z-index: 2;
  height: 40px;
  min-width: 200px;
  flex: 1;
  border-radius: 16px;
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

const PanelOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  left: 0;
  top: 0;
`

const ToggleList = ({ poolDatas }: { poolDatas: PoolData[] }) => {
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const checksumAddress = isAddress(input)

  const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)
  const connectedNetworkID = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.connectedNetworkID)
  const dispatch = useDispatch()

  const [menuItems, setMenuItems] = useState([])

  const [selectedItem, setSelectedItem] = React.useState('')

  const [showDrop, setShowDrop] = useState(false)

  const handleClick = () => {
    setShowDrop(true)
  }

  const handleClose = () => {
    setShowDrop(false)
  }

  useEffect(() => {
    
    let newMenuItems: ToggleMenuItem[] = []
    newMenuItems = RouterTypeToggle.filter((cell) => cell.chainID === 0 || cell.chainID === connectedNetworkID)
    setMenuItems(newMenuItems)

    newMenuItems.forEach((item) => {
      if (item.key === routerVersion) {
        setSelectedItem(item.value)
      }
    })
    
  }, [poolDatas, routerVersion, checksumAddress, connectedNetworkID])

  return (
    <>
      <ToggleWrapper>
        <Button onClick={handleClick} style={{ width: '100%' }} aria-label="token version">
          <MenuTitle>
            <span>{selectedItem}</span>
          </MenuTitle>
          <ArrowDropDownIcon style={{ color: '#fff' }} />
        </Button>
        {showDrop && (
          <MenuWrapper>
            {menuItems.map((item: any) => {
              return (
                <MenuItem
                  key={item.key}
                  onClick={() => {
                    setSelectedItem(item.value)
                    dispatch(typeRouterVersion({ routerVersion: item.key }))
                    handleClose()
                  }}
                >
                  {item.value}
                </MenuItem>
              )
            })}
          </MenuWrapper>
        )}
      </ToggleWrapper>
      {showDrop && (
        <PanelOverlay
          onClick={() => {
            setShowDrop(false)
          }}
        />
      )}
    </>
  )
}

export default ToggleList
