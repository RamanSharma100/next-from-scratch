export const handler = async (req: Request) => {
  return new Response(JSON.stringify({ message: 'Hello World API' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export default handler;
