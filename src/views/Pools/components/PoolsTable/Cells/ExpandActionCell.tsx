import React from 'react'
import styled from 'styled-components'
import { Text, ChevronDownIcon } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell from './BaseCell'

interface ExpandActionCellProps {
  expanded: boolean
  isFullLayout: boolean
}

const StyledCell = styled(BaseCell)`
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 100px;
  }
`

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  width: 44px;  
  height: 44px;
  margin-bottom: auto;
`

const TotalStakedCell: React.FC<ExpandActionCellProps> = ({ expanded, isFullLayout }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      {isFullLayout && (
        <Text color="#A7A7CC" bold fontSize='12px'>
          {expanded ? t('Hide') : t('Details')}
        </Text>
      )}
      <ArrowIcon color={expanded ? '#BC29B1' : 'white'} toggled={expanded} />
    </StyledCell>
  )
}

export default TotalStakedCell
