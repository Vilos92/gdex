import {globalStyle} from '@vanilla-extract/css';

import {darkHtmlSelector} from '@/styles/darkScheme';
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
  WebkitTextSizeAdjust: '100%'
});

globalStyle(darkHtmlSelector, {
  color: palette.textDark,
  backgroundColor: palette.pageBgDark
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
  color: palette.linkHover
});

globalStyle(`${darkHtmlSelector} a:hover`, {
  color: palette.linkHoverDark
});

globalStyle('h1', {
  textAlign: 'center'
});

globalStyle('input', {
  borderRadius: '8px',
  border: '1px solid transparent',
  padding: '0.6em 1.2em',
  fontSize: '1em',
  fontWeight: 500,
  fontFamily: 'inherit',
  color: palette.controlText,
  backgroundColor: palette.controlBg,
  transition: 'border-color 120ms',
  boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)',
  outline: 'none'
});

globalStyle(`${darkHtmlSelector} input`, {
  color: palette.controlTextDark,
  backgroundColor: palette.controlBgDark
});

globalStyle('button', {
  borderRadius: '8px',
  border: '1px solid transparent',
  padding: '0.6em 1.2em',
  fontSize: '1em',
  fontWeight: 500,
  fontFamily: 'inherit',
  color: palette.controlText,
  backgroundColor: palette.controlBg,
  transition: 'none',
  boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)',
  outline: 'none',
  cursor: 'default'
});

globalStyle('button:disabled', {
  cursor: 'default'
});

globalStyle(`${darkHtmlSelector} button`, {
  color: palette.controlTextDark,
  backgroundColor: palette.controlBgDark
});

globalStyle('button:hover', {
  borderColor: palette.controlBorderActive
});

globalStyle('button:active', {
  borderColor: palette.controlBorderActive,
  backgroundColor: palette.controlBgActive
});

globalStyle(`${darkHtmlSelector} button:active`, {
  backgroundColor: palette.controlBgActiveDark
});
