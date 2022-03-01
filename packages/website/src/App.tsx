import { LoginPanel } from './components/LoginPanel';

import './App.css';
import { useState } from 'react';
import { LoginServerResults } from './types';
import { HelloMessage } from './components/HelloMessage';
import { FamilyRegistration } from './components/FamilyRegistration';

var loginResults: LoginServerResults;

function App() {
  const [validated, setValidated] = useState(false);

  function onLoginSuccess(results: LoginServerResults) {
    loginResults = results;
    setValidated(true);
  }

  var loginPanel = <LoginPanel onSuccess={onLoginSuccess} />
  var helloPanel = <FamilyRegistration loginServerResults={loginResults} />;

  return (
    <div className="App">
      <header className="App-header">
        <div className='jumbotron'>
          <h1 className='display-4'>Gerald and Megan's Wedding</h1>
        </div>
        <br />
        {validated ? helloPanel : loginPanel}
      </header>
    </div>
  );
}

export default App;
