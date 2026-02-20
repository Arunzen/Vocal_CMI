import { FastifyRequest, FastifyReply } from 'fastify';
import { ConversationRequest, ConversationResponse } from '../types/conversation.ts';
import { GoogleGenAI, Type } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeConversation = async (
  request: FastifyRequest<{ Body: ConversationRequest }>,
  reply: FastifyReply
) => {
  const text = (request.body as any).text;

  if (!text) {
    return reply.status(400).send({ error: 'Text is required' });
  }

  try {
    const model = 'gemini-3.1-pro-preview';
    const prompt = `Analyze the following conversation and provide a summary, action items, and sentiment (positive, negative, or neutral).\n\nConversation:\n${text}`;

    const response = await genAI.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            actionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            sentiment: {
              type: Type.STRING,
              enum: ['positive', 'negative', 'neutral']
            }
          },
          required: ['summary', 'actionItems', 'sentiment']
        }
      }
    });

    if (!response.text) {
        throw new Error("No text in response from Gemini");
    }

    const analysis = JSON.parse(response.text);

    const conversationResponse: ConversationResponse = {
      summary: analysis.summary,
      actionItems: analysis.actionItems,
      sentiment: analysis.sentiment,
    };

    reply.send(conversationResponse);
  } catch (error) {
    console.error('Error analyzing conversation:', error);
    reply.status(500).send({ error: 'Failed to analyze conversation' });
  }
};

