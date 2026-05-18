import {style} from '@vanilla-extract/css';

import {palette} from '@/styles/tokens';

/*
 * Styles.
 */

export const container = style({
  margin: 0,
  paddingTop: '10vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center'
});

export const row = style({
  display: 'flex',
  justifyContent: 'center'
});

const logo = style({
  height: '6em',
  padding: '1.5em',
  willChange: 'filter',
  transition: '0.75s'
});

export const logoVite = style([
  logo,
  {
    selectors: {
      '&:hover': {
        filter: `drop-shadow(0 0 2em ${palette.viteGlow})`
      }
    }
  }
]);

export const logoTauri = style([
  logo,
  {
    selectors: {
      '&:hover': {
        filter: `drop-shadow(0 0 2em ${palette.tauriGlow})`
      }
    }
  }
]);

export const logoPreact = style([
  logo,
  {
    selectors: {
      '&:hover': {
        filter: `drop-shadow(0 0 2em ${palette.preactGlow})`
      }
    }
  }
]);

export const greetInput = style({
  marginRight: '5px'
});
