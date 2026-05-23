import {globalStyle} from '@vanilla-extract/css';

import {fonts, palette} from '@/styles/tokens';

/*
 * Styles.
 */

globalStyle(':root', {
  fontFamily: fonts.sans,
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: 400,
  color: palette.text,
  backgroundColor: palette.pageBg,
  fontSynthesis: 'none',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  WebkitTextSizeAdjust: '100%',
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.textDark,
      backgroundColor: palette.pageBgDark
    }
  }
});

globalStyle('html, body', {
  height: '100%',
  margin: 0,
  overflow: 'hidden'
});

globalStyle('#root', {
  height: '100%',
  overflow: 'hidden'
});

globalStyle('a', {
  fontWeight: 500,
  color: palette.link,
  textDecoration: 'inherit'
});

globalStyle('a:hover', {
  color: palette.linkHover,
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.linkHoverDark
    }
  }
});

globalStyle('h1', {
  textAlign: 'center'
});

globalStyle('input, button', {
  borderRadius: '8px',
  border: '1px solid transparent',
  padding: '0.6em 1.2em',
  fontSize: '1em',
  fontWeight: 500,
  fontFamily: 'inherit',
  color: palette.controlText,
  backgroundColor: palette.controlBg,
  transition: 'border-color 0.25s',
  boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)',
  outline: 'none',
  '@media': {
    '(prefers-color-scheme: dark)': {
      color: palette.controlTextDark,
      backgroundColor: palette.controlBgDark
    }
  }
});

globalStyle('button', {
  cursor: 'pointer'
});

globalStyle('button:hover', {
  borderColor: palette.controlBorderActive
});

globalStyle('button:active', {
  borderColor: palette.controlBorderActive,
  backgroundColor: palette.controlBgActive,
  '@media': {
    '(prefers-color-scheme: dark)': {
      backgroundColor: palette.controlBgActiveDark
    }
  }
});
