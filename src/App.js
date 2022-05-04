import WinXP from 'WinXP';
import { useGA } from 'hooks';
import { store } from 'app/store';
import { Provider } from 'react-redux';

const App = () => {
  useGA('UA-135148027-3', 'winXP');
  return (
    <Provider store={store}>
      <WinXP />
    </Provider>
  );
};

export default App;
