import {render} from 'preact';
import App from '@/App';
import '@/styles/global.css';
import '@/styles/workspaceTransition.css';

/*
 * Script.
 */

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element #root not found');
}

render(<App />, root);
