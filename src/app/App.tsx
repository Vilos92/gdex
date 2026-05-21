import {AppViews} from '@/app/AppViews';
import {useAppProjects} from '@/app/hooks/useAppProjects';

/*
 * Component.
 */

function App() {
  const app = useAppProjects();
  return <AppViews app={app} />;
}

export default App;
