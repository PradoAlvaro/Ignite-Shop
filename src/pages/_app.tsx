import { globalStyle } from '@/styles/global';
import type { AppProps } from 'next/app';
import logo from '@/assets/logo.svg'
import { Container, Header } from '@/styles/pages/app';
import Image from 'next/image';

globalStyle();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Image src={logo} alt="" />
      </Header>
      <Component {...pageProps} />
    </Container>
  );
}