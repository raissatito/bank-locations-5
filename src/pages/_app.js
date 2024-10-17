import "@/styles/globals.css"; // Your global CSS (likely includes Tailwind/DaisyUI)
import { SessionProvider } from "next-auth/react";
import 'leaflet/dist/leaflet.css';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}