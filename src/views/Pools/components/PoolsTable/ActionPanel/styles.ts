import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;
  flex-direction: row;
  display: flex;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 32px;
    margin-right: 0;
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
  }
`

export const HarvestActionContainer = styled.div`
  padding: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;
  flex-direction: row;
  display: flex;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 32px;
    margin-right: 0;
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
  }
`

export const ActionTitles = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 12px;
`

export const StakeActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
  position: absolute;
`

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
