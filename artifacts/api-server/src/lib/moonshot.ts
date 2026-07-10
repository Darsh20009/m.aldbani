const MOONSHOT_BASE = "https://api.moonshot.cn/v1";
export const MOONSHOT_MODEL = "moonshot-v1-32k";

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  name?: string;
}

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export interface MoonshotResponse {
  choices: Array<{
    message: {
      role: string;
      content: string | null;
      tool_calls?: ToolCall[];
    };
    finish_reason: string;
  }>;
}

function getKey(): string {
  const key = process.env.MOONSHOT_API_KEY;
  if (!key) throw new Error("MOONSHOT_API_KEY غير مضبوط في البيئة");
  return key;
}

export async function moonshotChat(
  messages: ChatMessage[],
  tools?: ToolDefinition[],
  stream = false
): Promise<Response> {
  const body: Record<string, unknown> = {
    model: MOONSHOT_MODEL,
    messages,
    temperature: 0.7,
    stream,
  };
  if (tools?.length) {
    body.tools = tools;
    body.tool_choice = "auto";
  }

  const res = await fetch(`${MOONSHOT_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getKey()}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Moonshot API error ${res.status}: ${errText}`);
  }
  return res;
}

export async function moonshotChatJSON(
  messages: ChatMessage[],
  tools?: ToolDefinition[]
): Promise<MoonshotResponse> {
  const res = await moonshotChat(messages, tools, false);
  return res.json() as Promise<MoonshotResponse>;
}
