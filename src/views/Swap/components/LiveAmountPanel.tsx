import React from 'react'
import { Flex, Text, useMatchBreakpoints } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { BalanceNumber } from 'components/BalanceNumber'
import Card from 'components/Card'

interface LiveAmountPanelProps {
    symbol: string
    amount: number
    price: number
}

const LiveAmountPanel: React.FC<LiveAmountPanelProps> = ({ symbol, amount, price }: LiveAmountPanelProps) => {
    const { t } = useTranslation()
    const { isXl } = useMatchBreakpoints()
    const isMobile = !isXl

    return (
        <Card bgColor="rgba(0, 0, 0, 0.2)" borderRadius="8px" margin={isMobile? "0 0 0 0": "1em 0 0 0"}>
            <Flex justifyContent="center">
                <Text color="white" fontSize="16px">
                    {t(symbol)}
                </Text>
            </Flex>
            <Flex justifyContent="space-between" mt={2}>
                <Text color="white" fontSize="14px">
                    {t('Amount')}
                </Text>
                <Text color="white" fontSize="14px">
                    <BalanceNumber prefix="" value={Number(amount).toFixed(2)} />
                </Text>
            </Flex>
            <Flex justifyContent="space-between" mt={2}>
                <Text color="white" fontSize="14px">
                    {t('Balance')}
                </Text>
                <Text color="white" fontSize="14px">
                    <BalanceNumber prefix="$ " value={Number(amount * price).toFixed(3)} />
                </Text>
            </Flex>
        </Card>
    )
}

export default LiveAmountPanel
