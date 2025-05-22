const handleApiRoutes = async (req: Request): Promise<Response> => {
  const path = new URL(req.url).pathname.replace('/api', '') || '/hello';

  const modulePath = `../../../src/api${path}.ts`;

  try {
    const handler = (await import(modulePath)).default;
    return handler(req);
  } catch {
    return new Response('404 | API Not Found', { status: 404 });
  }
};

export default handleApiRoutes;
