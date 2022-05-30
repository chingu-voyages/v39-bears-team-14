import React, { useState } from 'react';

import { store } from 'app/store';
import { useGA } from 'hooks';
import { Provider } from 'react-redux';
import WinXP from 'WinXP';

export const SessionContext = React.createContext();

const App = () => {
  useGA('UA-135148027-3', 'winXP');
  const [session, setSession] = useState(null);
  return (
    <Provider store={store}>
      <SessionContext.Provider value={[session, setSession]}>
        <WinXP />
      </SessionContext.Provider>
    </Provider>
  );
};

export default App;
