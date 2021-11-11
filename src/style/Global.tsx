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
    font-family: 'Raleway', sans-serif;
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

  .MuiPickersBasePicker-pickerView {
    max-width: unset !important;
  }
  div.MuiDialog-paper {
    position: unset !important;
  }
  div.MuiPickersBasePicker-container {
    div.MuiPaper-root {
      top: unset !important;
      left: unset !important;
      width: unset !important;
      button {
        outline: none;
      }
    }
  }
  button {
    outline: none !important;
  }
`

export default GlobalStyle
