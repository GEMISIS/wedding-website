import HelloMessage from './components/HelloMessage';
import { LoginPanel, LoginPanelResults } from './components/LoginPanel';

import './App.css';
import { useState } from 'react';

var loginResults: LoginPanelResults | undefined;

function App() {
  const [validated, setValidated] = useState(false);

  function onLoginSuccess(results: LoginPanelResults) {
    loginResults = results;
    setValidated(true);
  }

  var loginPanel = <LoginPanel onSuccess={onLoginSuccess} />
  var helloPanel = <HelloMessage myname={loginResults ? `${loginResults.firstName} ${loginResults.lastName}` : 'Invalid name'} />;

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
