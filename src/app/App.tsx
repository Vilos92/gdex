import {invoke} from '@tauri-apps/api/core';
import {openUrl} from '@tauri-apps/plugin-opener';
import {useState} from 'preact/hooks';
import * as styles from '@/app/app.css';
import preactLogo from '@/assets/preact.svg';

/*
 * Component.
 */

function App() {
  const [greetMessage, setGreetMessage] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    setGreetMessage(await invoke<string>('greet', {name}));
  }

  async function openExternal(url: string) {
    await openUrl(url);
  }

  return (
    <main class={styles.container}>
      <h1>Welcome to Tauri + Preact</h1>

      <div class={styles.row}>
        <a
          href="https://vite.dev"
          onClick={event => {
            event.preventDefault();
            openExternal('https://vite.dev');
          }}
        >
          <img src="/vite.svg" class={styles.logoVite} alt="Vite logo" />
        </a>
        <a
          href="https://tauri.app"
          onClick={event => {
            event.preventDefault();
            openExternal('https://tauri.app');
          }}
        >
          <img src="/tauri.svg" class={styles.logoTauri} alt="Tauri logo" />
        </a>
        <a
          href="https://preactjs.com"
          onClick={event => {
            event.preventDefault();
            openExternal('https://preactjs.com');
          }}
        >
          <img src={preactLogo} class={styles.logoPreact} alt="Preact logo" />
        </a>
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
          onInput={event => setName(event.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMessage}</p>
    </main>
  );
}

export default App;
