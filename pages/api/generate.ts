import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

console.log(process.env.OPENAI_API_KEY)
if (process.env.NEXT_PUBLIC_USE_USER_KEY !== "true") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  var { prompt, api_key } = (await req.json()) as {
    prompt?: string;
    api_key?: string
  };
  //todo make this variable into messages
  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }
  var content = "你是一位资深小红书运营人员，你目前负责的内容方向是撰写小红书文案，你的任务是生成小红书的内容文案。要求分解长句，减少重复，语气轻松幽默具有整体可读性。你现在要编写的文案主题是" + prompt

  // if (!process.env.OPENAI_MODEL) {
  //   throw new Error("Missing env var from OpenAI")
  // }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo-0613",
    messages: [{ role: "user", content: content }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
    api_key,
  }

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
