import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

dotenv.config();

const server = Fastify({
  logger: true
});

server.register(cors, {
  origin: '*', // Be more specific in production
});

server.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Register routes
import conversationRoutes from './routes/conversation.ts';
server.register(conversationRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await server.listen({ port: 5000, host: '0.0.0.0' });
    server.log.info(`Server listening on http://localhost:5000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
