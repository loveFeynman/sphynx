/* eslint @typescript-eslint/no-var-requires: "off" */

import React, { useMemo, ReactNode } from 'react'
import ReactDOM from 'react-dom'
import useActiveWeb3React from './hooks/useActiveWeb3React'
import { BLOCKED_ADDRESSES } from './config/constants'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import App from './App'
import Providers from './Providers'

require('dotenv').config()

console.log('REACT_APP_CHAIN_ID=', process.env.REACT_APP_CHAIN_ID)
console.log('REACT_APP_NODE_1=', process.env.REACT_APP_NODE_1)
console.log('REACT_APP_NODE_2=', process.env.REACT_APP_NODE_2)
console.log('REACT_APP_NODE_3=', process.env.REACT_APP_NODE_3)

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

function Blocklist({ children }: { children: ReactNode }) {
  const { account } = useActiveWeb3React()
  const blocked: boolean = useMemo(() => Boolean(account && BLOCKED_ADDRESSES.indexOf(account) !== -1), [account])
  if (blocked) {
    return <div>Blocked address</div>
  }
  return <>{children}</>
}

ReactDOM.render(
  <React.StrictMode>
    <Blocklist>
      <Providers>
        <Updaters />
        <App />
      </Providers>
    </Blocklist>
  </React.StrictMode>,
  document.getElementById('root'),
)
