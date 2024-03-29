import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout';
import { RecoilRoot } from 'recoil';

function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  );
}

export default App;
