import fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';

import { connectZookeeper, createDefaultToken } from './adapters/zookeeper';
import getNextNumber from './services/idService';
import { convertLongUrl, getLongUrl } from './services/urlService';

// Load environment variables
dotenv.config();

const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({});

// Route to create a short URL
app.post<{ Body: { url: string } }>('/shorten', async (request, reply) => {
  reply.type('application/json').code(200)
  return { shortUrl: await convertLongUrl(request.body.url) }
});

// Route to redirect a short URL to the original one
app.get<{ Params: { key: string } }>('/:key', async (request, reply) => {
  reply.redirect(301, await getLongUrl(request.params.key))
});

app.get<{ Params: { key: string } }>('/next-id', async (request, reply) => {
  reply.type('application/json').code(200)
  return { id: await getNextNumber() }
});

const start = async () => {
  try {
    await connectZookeeper();
    createDefaultToken();
    app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
      if (err) throw err
      console.log(`Server listening on ${address}`);
    })
    
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
