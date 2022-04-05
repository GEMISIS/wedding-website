import './App.css';
import { useState } from 'react';
import { FamilyInfo, LoginRequest } from './types';
import { LoginPanel } from './components/LoginPanel';
import { FamilyRegistration } from './components/registration/FamilyRegistration';
import { Tab, Tabs } from 'react-bootstrap';
import { HelloMessage } from './components/HelloMessage';
import { Hotels } from './components/hotel-info/Hotels';
import { DayOfInfo } from './components/day-of-info/DayOfInfo';
import { RegistryInfo } from './components/registry/RegistryInfo';
import { Transportation } from './components/transportation/Transportation';
const config = require('./config.json');

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
          <h1 className='display-1'>{config.headerText}</h1>
        </div>
      </header>
      <div className={"App-content align-items-center justify-content-center" + (loggedIn ? "" : " d-flex")}>
        {loggedIn ? (
            <Tabs className="App-tabs mb-2">
              <Tab className='registrationContent' eventKey="registration" title="Registration">
                <FamilyRegistration loginInfo={loginInfo} startingFamilyInfo={familyInfo} />
              </Tab>
              <Tab className='hotelContent' eventKey="hotels" title="Hotels">
                <Hotels />
              </Tab>
              <Tab className='transportationContent' eventKey="transportation" title="Transportation">
                <Transportation />
              </Tab>
              {/* <Tab className='registryContent' eventKey="registry" title="Registry">
                <RegistryInfo />
              </Tab> */}
              <Tab className='dayOfInfoContent' eventKey="dayOfInfo" title="Day of Information">
                <DayOfInfo />
              </Tab>
            </Tabs>
          ) : <LoginPanel onSuccess={onLoginSuccess} />
        }
      </div>
    </div>
  );
}

export default App;
