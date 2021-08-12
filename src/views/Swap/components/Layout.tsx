import styled from 'styled-components'

const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > div {
    width: 100%;
    margin-bottom: 24px;
    ${({ theme }) => theme.mediaQueries.md} {
      &:nth-child(2n + 1) {
        width: 320px;
      }
      &:nth-child(2n) {
        margin-left: 24px;
        width: calc(100% - 344px);
      }
    }
  }
`

export default Cards;
