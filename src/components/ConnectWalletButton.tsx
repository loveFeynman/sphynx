import React from 'react'
import { Button, useWalletModal } from '@sphynxswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import storages from 'config/constants/storages'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  const onClickedConnect = () => {
    sessionStorage.setItem(storages.SESSION_REMOVED_TOKENS, null);
    onPresentConnectModal()
  }

  return (
    <Button onClick={onClickedConnect} {...props}>
      {t('Connect')}
    </Button>
  )
}

export default ConnectWalletButton
