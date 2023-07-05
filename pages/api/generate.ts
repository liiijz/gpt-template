import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

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
  var p = `帮我制作一篇内容为《${prompt}》的PPT，要求如下：
  第一、一定要使用中文。
  第二、页面形式有3种，封面、目录、列表。
  第三、目录页要列出内容大纲。
  第四、根据内容大纲，生成对应的PPT列表页，每一页PPT列表页使用=====列表=====开头。
  第五、封面页格式如下：
  =====封面=====
  # 主标题
  ## 副标题
  演讲人：华王code（替换为自己的名字）
  第六、目录页格式如下：
  =====目录=====
  # 目录
  ## CONTENT
  1、内容
  2、内容
  第七、列表页格式如下：
  =====列表=====
  # 页面主标题
  1、要点1
  要点描述内容
  第八、列表页里的要点描述内容是对要点的详细描述，10个字以上，50个字以内。
  最后，必须用markdown语法，在新窗口生成代码。`

  // if (!process.env.OPENAI_MODEL) {
  //   throw new Error("Missing env var from OpenAI")
  // }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: p }],
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
