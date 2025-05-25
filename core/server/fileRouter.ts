import React from 'react';
import { renderToString } from 'react-dom/server';
import { rootDir } from '.';
import { readFileSync } from 'fs';
import { createRoot } from 'react-dom/client';

const getAppFile = async (): Promise<React.ReactNode> => {
  const appFilePath = rootDir + '/src/pages/_app.tsx';
  try {
    const appFile = await import(appFilePath);
    return appFile.default;
  } catch (error) {
    // console.error(`Error loading app file: ${error}`);
    return null;
  }
};

const getDocumentFile = async (): Promise<React.ReactNode> => {
  const documentFilePath = rootDir + '/src/pages/_document.tsx';
  try {
    const documentFile = await import(documentFilePath);
    return documentFile.default;
  } catch (error) {
    // console.error(`Error loading document file: ${error}`);
    return null;
  }
};

export const getComponentType = (filePath: string): 'client' | 'server' => {
  try {
    const code = readFileSync(filePath, 'utf-8');
    if (
      code.trimStart().startsWith('"use client"') ||
      code.trimStart().startsWith("'use client'")
    ) {
      return 'client';
    }

    if (
      code.trimStart().startsWith('"use server"') ||
      code.trimStart().startsWith("'use server'")
    ) {
      return 'server';
    }
  } catch {}
  return 'server';
};

const handleFileRoutes = async (url: URL): Promise<Response | null> => {
  const routePath = url.pathname === '/' ? '/index' : url.pathname;
  const modulePath = `${rootDir}/src/pages${routePath}.tsx`;

  try {
    const module = await import(modulePath);
    const component = module.default;

    const componentType = getComponentType(modulePath);
    let html = component();

    if (module && component) {
      if (componentType === 'client') {
        html = createRoot(document.createElement('div')).render(
          React.createElement(component)
        );
      }
      const App: any = await getAppFile();
      const Document: any = await getDocumentFile();

      if (App && Document) {
        const htmlWithApp = App({ children: html });
        const htmlWithDocument = renderToString(
          Document({ children: htmlWithApp })
        );
        return new Response(htmlWithDocument, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      if (Document && !App) {
        const htmlWithDocument = renderToString(Document({ children: html }));
        return new Response(htmlWithDocument, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      if (App && !Document) {
        const htmlWithApp = App({ children: html });
        return new Response(htmlWithApp, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      // If App exists or Document does not, just return the rendered component
      const response = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <div id="root">${html}</div>
    </body>
</html>`;
      return new Response(response, {
        headers: { 'Content-Type': 'text/html' },
      });
    } else {
      console.error(
        `Module ${modulePath} does not export a default component.`
      );
      return null;
    }
  } catch (e) {
    console.error(`Error loading module ${modulePath}:`, e);
    return null;
  }
};

export default handleFileRoutes;
