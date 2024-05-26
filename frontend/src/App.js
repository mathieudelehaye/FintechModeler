import Variability from './components/Variability.tsx';

import logo from './logo.svg';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <Variability />
        </p>
      </header>
    </div>
  );
}

export default App;
