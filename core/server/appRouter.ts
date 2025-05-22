import { renderToString } from 'react-dom/server';
import { rootDir } from '.';

const handleAppRoutes = async (url: URL): Promise<Response | null> => {
  const routePath = url.pathname === '/' ? '/page' : `${url.pathname}/page`;
  const layoutPath = `${rootDir}/src/app/layout.tsx`;
  const modulePath = `${rootDir}/src/app${routePath}.tsx`;

  try {
    const Page = await import(modulePath);
    const Layout = await import(layoutPath);
    const html = renderToString(Layout.default({ children: Page.default() }));
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (e) {
    console.error(`Error loading module ${modulePath}:`, e);
    return null;
  }
};

export default handleAppRoutes;
