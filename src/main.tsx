import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import './styles.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter basename='/interno'>
    <App />
  </BrowserRouter>
  // </React.StrictMode>,
);
