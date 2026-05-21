import {AppViews} from '@/AppViews';
import {useAppProjects} from '@/hooks/useAppProjects';

/*
 * Component.
 */

function App() {
  const app = useAppProjects();
  return <AppViews app={app} />;
}

export default App;
