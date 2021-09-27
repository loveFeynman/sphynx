import React from 'react';
import NumberFormat from 'react-number-format'
import { Text } from '@sphynxswap/uikit'

export function BalanceNumber({ prefix, value }) {
    return (
      <NumberFormat
        value={value}
        displayType='text'
        thousandSeparator
        prefix={prefix}
        renderText={formattedValue => <b>{formattedValue}</b>}
      />
    );
}