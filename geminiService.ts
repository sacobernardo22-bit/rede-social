import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateAIResponse = async (prompt: string, history: { role: string, parts: { text: string }[] }[] = []) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "Você é um assistente inteligente integrado em uma rede social moderna chamada Nexus. Você ajuda usuários com dúvidas, conversas amigáveis, criação de posts e ideias de conteúdo. Seja criativo, prestativo e use uma linguagem jovem e moderna.",
      },
      contents: [
        ...history.map(h => ({ role: h.role === 'model' ? 'model' : 'user', parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ]
    });

    return response.text || "Desculpe, não consegui gerar uma resposta.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Desculpe, tive um problema ao processar sua solicitação. Tente novamente mais tarde.";
  }
};
