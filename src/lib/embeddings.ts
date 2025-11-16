import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  console.error("OpenAI Key:", process.env.OPENAI_API_KEY ? "Loaded" : "Missing");
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    
    if (!response.ok) {
        const errorResult = await response.json();
        console.error("OpenAI API Error Status:", response.status);
        console.error("OpenAI API Error Body:", JSON.stringify(errorResult, null, 2));
        throw new Error(`OpenAI API failed with status ${response.status}`);
    }

    const result = await response.json();

    return result.data[0].embedding as number[]; 
    
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}