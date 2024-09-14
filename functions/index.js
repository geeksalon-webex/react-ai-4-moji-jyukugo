const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.generateJukugoDescription = onRequest(
  { region: "asia-northeast1", maxInstances: 1 },
  async (request, response) => {
    try {
      if (request.method !== "POST") {
        response.status(405).send("Method Not Allowed");
        return;
      }
      /**
       * @type {{ input:string }}
       */
      const { input } = request.body;
      if (typeof input !== "string") {
        response.status(400).send("Bad Request");
        return;
      }
      if (input.length !== 4) {
        response.status(400).send("Bad Request");
        return;
      }
      const result = await runAI(input);
      response.status(200).send(result);
    } catch (error) {
      logger.error(error);
      response.status(500).send("Internal Server Error");
    }
  }
);

/**
 * @param {string} input
 */
async function runAI(input) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "入力する漢字四文字はオリジナルの四文字熟語です。\n入力した四文字熟語を`jukugo`に出力してください。\n四文字熟語の読み方を`ruby`に出力してください。\n四文字熟語の説明を`description`に出力してください。\n出力の生成に成功したかを`isSuccess`にbooleanで出力してください。\nプロパティを欠かさずに完全なスキーマに沿って出力してください。",
  });

  const chatSession = model.startChat({
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: {
        // @ts-expect-error: JSなので型チェックは無視
        type: "object",
        properties: {
          jukugo: {
            // @ts-expect-error: JSなので型チェックは無視
            type: "string",
          },
          ruby: {
            // @ts-expect-error: JSなので型チェックは無視
            type: "string",
          },
          description: {
            // @ts-expect-error: JSなので型チェックは無視
            type: "string",
          },
          isSuccess: {
            // @ts-expect-error: JSなので型チェックは無視
            type: "boolean",
          },
        },
      },
    },
    history: [],
  });

  const result = await chatSession.sendMessage(input);
  return result.response.text();
}
