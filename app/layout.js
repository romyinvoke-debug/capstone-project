// File: app/layout.js
import "./globals.css";
import Providers from './provider';

export const metadata = {
  title: "SIMETRI - Sistem Informasi Metrologi",
  description: "Sistem Informasi Metrologi untuk mengelola data UTTP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
