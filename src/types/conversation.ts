export interface ConversationRequest {
  text: string;
}

export interface ConversationResponse {
  summary: string;
  actionItems: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}
