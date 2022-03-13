import { LoginPanel } from './components/LoginPanel';

import './App.css';
import { useState } from 'react';
import { FamilyInfo, LoginRequest } from './types';
import { FamilyRegistration } from './components/registration/FamilyRegistration';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [familyInfo, setFamilyInfo] = useState({} as FamilyInfo);
  const [loginInfo, setLoginInfo] = useState(new LoginRequest());

  function onLoginSuccess(loginInfo: LoginRequest, familyInfo: FamilyInfo) {
    setLoginInfo(loginInfo);
    setFamilyInfo(familyInfo);
    setLoggedIn(true);
  }

  var loginPanel = <LoginPanel onSuccess={onLoginSuccess} />
  var registrationPanel = <FamilyRegistration loginInfo={loginInfo} startingFamilyInfo={familyInfo} />;

  return (
    <div className="App">
      <header className="App-header">
        <div className='jumbotron'>
          <h1 className='display-4'>Gerald and Megan's Wedding</h1>
        </div>
        <br />
        {loggedIn ? registrationPanel : loginPanel}
      </header>
    </div>
  );
}

export default App;
