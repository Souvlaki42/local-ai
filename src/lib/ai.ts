export type AITextSessionOptions = {
  maxTokens: number;
  temperature: number;
  tokensLeft: number;
  tokensSoFar: number;
  topK: number;
};

export type AITextSession = {
  prompt(input: string): Promise<string>;
  promptStreaming(input: string): ReadableStream<string>;
  destroy(): void;
};

export type Role = "User" | "Assistant";

export type AIAvailability = "readily" | "after-download" | "no";

export type ChatMessageType = {
  id: string;
  content: string;
  role: Role;
  isError: boolean;
  timestamp: number;
};

export type Capabilities = {
  available: AIAvailability;
  defaultTemperature: number;
  defaultTopK: number;
  maxTopK: number;
};

declare global {
  interface Window {
    ai: {
      languageModel: {
        capabilities: () => Promise<Capabilities>;
        create: (
          options?: Partial<AITextSessionOptions>,
        ) => Promise<AITextSession>;
      };
    };
  }
}

export async function safeAwait<T, E = Error>(
  promise: Promise<T>,
): Promise<[null, T] | [E, null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (err) {
    return [err as E, null];
  }
}

export async function getAICompletion(
  input: string,
  session?: AITextSession,
): Promise<ChatMessageType> {
  const errorMessage = (error?: string): ChatMessageType => ({
    id: crypto.randomUUID(),
    content: error ?? "Sorry, I encountered an error. Please try again.",
    role: "Assistant",
    timestamp: Date.now(),
    isError: true,
  });

  if (!session) {
    return errorMessage();
  }

  const [error, response] = await safeAwait(session.prompt(input));
  if (error) {
    return errorMessage(error.message);
  }

  return {
    id: crypto.randomUUID(),
    content: response,
    role: "Assistant",
    timestamp: Date.now(),
    isError: false,
  };
}

export async function checkAIAvailability(): Promise<boolean> {
  const capabilities = await window.ai.languageModel.capabilities();
  return capabilities.available === "readily";
}
