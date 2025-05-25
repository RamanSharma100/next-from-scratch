import { renderToString } from 'react-dom/server';
import { rootDir } from '.';
import { getComponentType } from './fileRouter';
import { createRoot } from 'react-dom/client';
import React from 'react';

const handleAppRoutes = async (url: URL): Promise<Response | null> => {
  const routePath = url.pathname === '/' ? '/page' : `${url.pathname}/page`;
  const layoutPath = `${rootDir}/src/app/layout.tsx`;
  const modulePath = `${rootDir}/src/app${routePath}.tsx`;

  const componentType = getComponentType(modulePath);

  try {
    const Page = await import(modulePath);
    const Layout = await import(layoutPath);
    let html = renderToString(Layout.default({ children: Page.default() }));
    if (componentType === 'client') {
      html = renderToString(
        Layout.default({
          children: createRoot(document.createElement('div')).render(
            React.createElement(Page.default)
          ),
        })
      );
    }
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (e) {
    console.error(`Error loading module ${modulePath}:`, e);
    return null;
  }
};

export default handleAppRoutes;
