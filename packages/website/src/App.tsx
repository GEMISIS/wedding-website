import './App.css';
import { useState } from 'react';
import { FamilyInfo, LoginRequest } from './types';
import { LoginPanel } from './components/LoginPanel';
import { FamilyRegistration } from './components/registration/FamilyRegistration';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { HelloMessage } from './components/HelloMessage';
import { Hotels } from './components/hotel-info/Hotels';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [familyInfo, setFamilyInfo] = useState({} as FamilyInfo);
  const [loginInfo, setLoginInfo] = useState(new LoginRequest());

  function onLoginSuccess(loginInfo: LoginRequest, familyInfo: FamilyInfo) {
    setLoginInfo(loginInfo);
    setFamilyInfo(familyInfo);
    setLoggedIn(true);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='jumbotron'>
          <h1 className='display-1'>Gerald and Megan's Wedding</h1>
        </div>
      </header>
      <div className={"App-content align-items-center justify-content-center" + (loggedIn ? "" : " d-flex")}>
        {loggedIn ? (
            <Tabs className="App-tabs mb-2">
              <Tab style={{textAlign: 'center'}} eventKey="registration" title="Registration">
                <FamilyRegistration loginInfo={loginInfo} startingFamilyInfo={familyInfo} />
              </Tab>
              <Tab eventKey="hotels" title="Hotels">
                <Hotels />
              </Tab>
              <Tab eventKey="registry" title="Registry">
                <HelloMessage myname='test' />
              </Tab>
              <Tab eventKey="faq" title="FAQ">
                <HelloMessage myname='test' />
              </Tab>
            </Tabs>
          ) : <LoginPanel onSuccess={onLoginSuccess} />
        }
      </div>
    </div>
  );
}

export default App;
