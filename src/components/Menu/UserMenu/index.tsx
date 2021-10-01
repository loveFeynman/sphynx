import React from 'react'
import { useWeb3React } from '@web3-react/core'
import {
  Flex,
  LogoutIcon,
  UserMenu as UIKitUserMenu,
  UserMenuItem,
} from '@sphynxswap/uikit'
import useAuth from 'hooks/useAuth'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'

const UserMenu = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { logout } = useAuth()

  if (!account) {
    return <ConnectWalletButton />
  }

  return (
    <div style={{ position: 'relative' }}>
      <UIKitUserMenu account={account} avatarSrc="/images/EmptyAvatar.svg">
        <UserMenuItem
          as="button"
          onClick={() => {
            logout()
          }}
        >
          <Flex alignItems="center" justifyContent="space-between" width="100%" height="100%">
            {t('Sign out')}
            <LogoutIcon />
          </Flex>
        </UserMenuItem>
      </UIKitUserMenu>
    </div>
  )
}

export default UserMenu
