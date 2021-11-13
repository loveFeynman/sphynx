import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@sphynxswap/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Roboto Regular';
    font-display: swap;
    font-style: normal;
    font-weight: normal;
    src: local('/fonts/Roboto Regular'), url('/fonts/Roboto-Regular.woff') format('woff');
  }
  * {
    font-family: 'Montserrat', sans-serif;
    font-display: swap;
  }
  body {
    // background-color: ${({ theme }) => theme.colors.background};
    background-color: #000 !important;

    img {
      height: auto;
      max-width: 100%;
    }
  }
  #simple-menu {
    .MuiMenu-paper {
      background: #151515;
      color: white;
    }
  }

  .marquee-container {
    overflow: hidden !important;
  }

  .sc-gInthZ {
    background: ${({ theme }) => (theme.isDark ? '#27262c !important' : '#191c41 !important')};
  }
  .eTJGWm {
    background: ${({ theme }) => (theme.isDark ? '#27262c !important' : '#191c41 !important')};
    border: ${({ theme }) => (theme.isDark ? '' : '1px solid #2E2E55 !important')}; 
  }
  div.kGLpkw {
    div {
      background: ${({ theme }) => (theme.isDark ? '#27262c !important' : '#191c41 !important')};
    }
  }

  .gJyxrV {
    border: ${({ theme }) => (theme.isDark ? '' : '1px solid #2E2E55 !important')}; 
  }
  .gruiCo, .sc-gInthZ {
    border-bottom: ${({ theme }) => (theme.isDark ? '' : '1px solid #2E2E55 !important')}; 
  }
`

export default GlobalStyle
