import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { SnackbarProvider } from 'notistack';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ScrollToTop from './components/scroll-to-top';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import ThemeProvider from './theme';
import ContextProvider from './context/ContextProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
const network = WalletAdapterNetwork.Devnet;

root.render(
  <ConnectionProvider endpoint={'https://api.devnet.solana.com'}>
    <WalletProvider wallets={[]} autoConnect>
      <WalletModalProvider>
        <ContextProvider>
          <HelmetProvider>
            <BrowserRouter>
              <ThemeProvider>
                <ScrollToTop />
                <SnackbarProvider preventDuplicate>
                  <App />
                </SnackbarProvider>
              </ThemeProvider>
            </BrowserRouter>
          </HelmetProvider>
        </ContextProvider>
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>

);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
