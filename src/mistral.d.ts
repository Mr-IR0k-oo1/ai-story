declare module "@mistralai/mistralai" {
  export class Mistral {
    constructor(options: { apiKey: string });
    chat: {
      complete(options: {
        model: string;
        messages: { role: string; content: string }[];
        maxTokens?: number;
        temperature?: number;
        responseFormat?: { type: string };
      }): Promise<{
        choices?: { message?: { content?: string | null } }[];
      }>;
    };
  }
}
