const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <main>
          <header>App Layout</header>
          {children}
        </main>
      </body>
    </html>
  );
};

export default Layout;
