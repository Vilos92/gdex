import {invoke} from '@tauri-apps/api/core';
import {openUrl} from '@tauri-apps/plugin-opener';
import type {PropsWithChildren} from 'preact/compat';
import {useState} from 'preact/hooks';
import * as styles from '@/app/app.css';
import preactLogo from '@/assets/preact.svg';

/*
 * Types.
 */

type ExternalLinkProps = PropsWithChildren<{
  href: string;
}>;

/*
 * Component.
 */

function ExternalLink({href, children}: ExternalLinkProps) {
  return (
    <a
      href={href}
      onClick={event => {
        event.preventDefault();
        openExternal(href);
      }}
    >
      {children}
    </a>
  );
}

function App() {
  const [greetMessage, setGreetMessage] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    try {
      setGreetMessage(await invoke<string>('greet', {name}));
    } catch (error) {
      console.error('greet failed', error);
      setGreetMessage('Could not greet — is the app running in Tauri?');
    }
  }

  return (
    <main class={styles.container}>
      <h1>Welcome to Tauri + Preact</h1>

      <div class={styles.row}>
        <ExternalLink href="https://vite.dev">
          <img src="/vite.svg" class={styles.logoVite} alt="Vite logo" />
        </ExternalLink>
        <ExternalLink href="https://tauri.app">
          <img src="/tauri.svg" class={styles.logoTauri} alt="Tauri logo" />
        </ExternalLink>
        <ExternalLink href="https://preactjs.com">
          <img src={preactLogo} class={styles.logoPreact} alt="Preact logo" />
        </ExternalLink>
      </div>

      <p>Click on the Tauri, Vite, and Preact logos to learn more.</p>

      <form
        class={styles.row}
        onSubmit={event => {
          event.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          class={styles.greetInput}
          value={name}
          onInput={event => setName(event.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMessage}</p>
    </main>
  );
}

/*
 * Helpers.
 */

async function openExternal(url: string) {
  try {
    await openUrl(url);
  } catch (error) {
    console.error('openExternal failed', error);
  }
}

export default App;
