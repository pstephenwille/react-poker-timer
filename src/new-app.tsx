import { Header } from './new-components/header';
import { MainDisplay } from './components/main-display';

export function NewApp() {

  return (
    <div className="app">
      <Header />
      <MainDisplay />
    </div>
  )
}