import { useState, useEffect } from 'react';

import { store } from 'app/store';
import { useGA } from 'hooks';
import { Provider } from 'react-redux';
import WinXP from 'WinXP';

import Account from './userAuth//Account';
import Auth from './userAuth//Auth';
import { supabase } from './userAuth/supabaseClient';

const App = () => {
  const [session, setSession] = useState(null);
  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  useGA('UA-135148027-3', 'winXP');
  return session ? (
    <Account key={session.user.id} session={session} />
  ) : (
    <Auth />
  );
  /*
      <Provider store={store}>
      <WinXP />
    </Provider>
  */
};

export default App;
