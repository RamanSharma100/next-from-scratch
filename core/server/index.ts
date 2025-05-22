import { exists } from 'fs/promises';

export const rootDir = process.cwd();

import handleFileRoutes from './fileRouter';
import handleAppRoutes from './appRouter';
import handleApiRoutes from './apiRoutes';

const getArgsInJson = () => {
  const args = process.argv.slice(2);
  const jsonArgs: Record<string, string> = {};
  args.forEach((arg: string) => {
    const [key, value] = arg.split('=');
    if (key && value) {
      jsonArgs[key.replace('--', '')] = value;
    }
  });

  return jsonArgs;
};

const routeExistsInAppRouter = async (url: URL): Promise<boolean> => {
  const appPath = url.pathname === '/' ? '/page' : `${url.pathname}/page`;
  const modulePath = `${rootDir}/src/app${appPath}.tsx`;

  try {
    return await exists(modulePath);
  } catch (e) {
    return false;
  }
};

const routeExistsInFileRouter = async (url: URL): Promise<boolean> => {
  const routePath = url.pathname === '/' ? '/index' : url.pathname;
  const modulePath = `${rootDir}/src/pages${routePath}.tsx`;

  try {
    return await exists(modulePath);
  } catch (e) {
    return false;
  }
};

const handleRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const { pathname } = url;

  let response: Response | null = null;

  if (pathname.startsWith('/api')) {
    response = await handleApiRoutes(req);
  } else {
    const isAppRoute = await routeExistsInAppRouter(url);
    const isFileRoute = await routeExistsInFileRouter(url);

    if (isAppRoute && isFileRoute) {
      console.warn(
        `Warning: Both app and file routes exist for ${pathname}. App route will be used.`
      );
    }

    if (isAppRoute) {
      response = await handleAppRoutes(url);
    } else {
      response = await handleFileRoutes(url);
    }
  }

  if (response === null) {
    return new Response('404 | Not Found', { status: 404 });
  }
  return response;
};

const args = getArgsInJson();
const { port } = args;

console.log(`Server is starting on http://localhost:${port || '3000'}`);

Bun.serve({
  port: Number(port || '3000') || 3000,
  fetch: async (req: Request) => {
    return handleRequest(req);
  },
});
