import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { analyzeConversation } from '../controllers/conversationController.ts';
import { ConversationRequest } from '../types/conversation.ts';

export default async function (fastify: FastifyInstance) {
  fastify.post('/conversation', {
    handler: async (request: FastifyRequest<{ Body: ConversationRequest; }>, reply: FastifyReply) => {
      return analyzeConversation(request, reply);
    }
  });
}
