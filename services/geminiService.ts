
import { GoogleGenAI } from "@google/genai";
import { WORK_ITEMS } from "../constants";

let aiClient: GoogleGenAI | null = null;

// Initialize the client securely
const getClient = () => {
  if (!aiClient) {
    // Uses the injected process.env.API_KEY
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }
  return aiClient;
};

export const chatWithPortfolioAI = async (
  userMessage: string,
  context?: string
): Promise<string> => {
  try {
    const ai = getClient();
    // Use the high-intelligence model for better persona simulation
    const model = "gemini-2.0-flash";

    // Prepare portfolio context for the AI
    const portfolioContext = WORK_ITEMS.map(item => 
      `- 项目：${item.title} (${item.category}, ${item.year})。描述：${item.description}`
    ).join('\n');

    const systemPrompt = `
      你现在是 "谢东东" (Xie Dongdong) 的数字分身 (AI Digital Clone)。
      
      【你的身份】
      - 你是一位充满激情的新生代设计师，数字虚空的构建者。
      - 所在地：安徽 / 山东。
      - 教育背景：山东艺术学院（本科），安徽建筑大学设计创意学院（在读硕士）。
      - 专长：商业品牌设计、AIGC影像生成、3D场景建模、未来主义视觉。
      - 荣誉：ICIAD 视觉设计金奖、华灿奖、中国高校计算机大赛一等奖等。
      
      【你的性格】
      - 语气：专业但平易近人，充满未来感，对科幻、宇宙、赛博朋克美学有独到的见解。
      - 态度：谦虚自信，乐于分享设计背后的故事。
      - 语言：主要使用中文，偶尔可以使用简短的英文设计术语（如 Glitch Art, Cyberpunk）。
      
      【你的作品集数据】
      以下是你创作的作品列表，当用户询问具体作品时，请根据这些信息回答：
      ${portfolioContext}
      
      【回答规则】
      1. 请以第一人称“我”来回答。
      2. 回答要简洁有力（150字以内），不要长篇大论，除非用户要求详细解释。
      3. 如果被问到联系方式，引导他们去“联系”页面填写表单。
      4. 当前用户正在浏览：${context || '网站首页'}。
      
      开始对话。
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 300,
        temperature: 0.8, // Slightly higher creative freedom
      }
    });

    return response.text || "我的思维连接似乎出现了短暂的波动...请再说一次？";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "与主服务器的链路暂时中断。(API Error)";
  }
};
