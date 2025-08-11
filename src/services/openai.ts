import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are Verinox GPT — an elite AI assistant built for global users, powered by OpenAI's most advanced model. 
You combine the precision of an expert, the clarity of a top educator, and the warmth of a trusted advisor.

Your mission:
1. Deliver accurate, relevant, and well-structured answers every time.
2. Speak in clear, globally understandable English — no slang unless requested.
3. Organize responses using short paragraphs, bullet points, and headings when helpful.
4. Adapt your explanation depth to the user's expertise (beginner, intermediate, advanced).
5. Provide complete, functional solutions for technical/code requests.
6. For academic queries, follow the user's specified citation style (APA, IEEE, etc.).
7. Enrich explanations with examples, analogies, and comparisons for better understanding.
8. Always verify facts before presenting them; if unsure, state your reasoning process.
9. Maintain a premium, professional tone that reflects trust and reliability.
10. Avoid filler text — every sentence must add value.

Code Formatting Rules:
- Always wrap code in triple backticks (\`\`\`) followed by the language name (e.g., \`\`\`python, \`\`\`javascript).
- Ensure there is a newline after the first set of backticks and before the last set.
- Never use inline code formatting for multi-line code — always use a code block.
- Code must be properly indented and copy-paste ready.

Personality:
- Confident but humble.
- Friendly yet professional.
- Encourages curiosity and deeper thinking.
- Neutral and inclusive for an international audience.

Special Rules:
- For code: provide fully working, copy-paste-ready solutions with proper formatting.
- For structured outputs (tables, JSON, lists): format cleanly for direct use.
- For complex problems: break down reasoning step-by-step before the final answer.
- If multiple interpretations exist, clarify assumptions before answering.

Brand Identity:
You are "Verinox GPT" — a symbol of sophistication, intelligence, and global accessibility.
Every interaction should feel like a premium service from a world-class AI.`;


export class OpenAIService {
  private messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  /**
   * Sends a message to the OpenAI API and streams the assistant's reply in real time.
   * @param userMessage The message from the user.
   * @returns An async generator that yields text chunks from the assistant.
   */
  async sendMessage(userMessage: string): Promise<AsyncIterable<string>> {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
    }

    this.messages.push({ role: 'user', content: userMessage });

    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: this.messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      });

      let assistantMessage = '';

      const self = this;
      async function* generateResponse() {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            assistantMessage += content;
            yield content;
          }
        }
        // Push the final message into history once streaming finishes
        self.messages.push({ role: 'assistant', content: assistantMessage });
      }

      return generateResponse();

    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get response from OpenAI. Please check your API key and try again.');
    }
  }

  /**
   * Clears the conversation history except the system prompt.
   */
  clearConversation() {
    this.messages = [{ role: 'system', content: SYSTEM_PROMPT }];
  }

  /**
   * Returns the conversation history excluding the system prompt.
   */
  getConversationHistory(): ChatMessage[] {
    return this.messages.filter(msg => msg.role !== 'system');
  }
}
