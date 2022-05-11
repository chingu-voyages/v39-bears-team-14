import { store } from 'app/store';
import { useGA } from 'hooks';
import { Provider } from 'react-redux';
import WinXP from 'WinXP';

const App = () => {
  useGA('UA-135148027-3', 'winXP');
  return (
    <Provider store={store}>
      <WinXP />
    </Provider>
  );
};

export default App;
