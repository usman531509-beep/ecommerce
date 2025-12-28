// import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
// import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// // RetrievalQAChain ab yahan se import hoga:

// import Product from "../models/Product.js";

// export const chatWithBot = async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!process.env.OPENAI_API_KEY) {
//         return res.status(500).json({ reply: "OpenAI API Key is missing in .env file." });
//     }

//     // 1. Database se products ka data lein
//     const products = await Product.find({});
//     const productDataString = products.map(p => 
//       `Product Name: ${p.name}, Price: ${p.price}, Description: ${p.description}, Category: ${p.category}, Stock: ${p.stock}`
//     ).join("\n\n");

//     // 2. Data ko chunks mein divide karein
//     const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
//     const docs = await splitter.createDocuments([productDataString]);

//     // 3. Vector Store banayein
//     const vectorStore = await HNSWLib.fromDocuments(
//       docs,
//       new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY })
//     );

//     // 4. AI Model aur Retriever setup karein
//     const model = new ChatOpenAI({ 
//         modelName: "gpt-3.5-turbo", 
//         temperature: 0.7,
//         openAIApiKey: process.env.OPENAI_API_KEY 
//     });

//     // 5. Naye tarike se query karein
//     const retriever = vectorStore.asRetriever();
//     const relevantDocs = await retriever.getRelevantDocuments(message);
    
//     // Simple prompt context injection
//     const context = relevantDocs.map(d => d.pageContent).join("\n");
//     const prompt = `You are a helpful assistant for Atelier store. Use the following context to answer the user question.
//     Context: ${context}
//     Question: ${message}`;

//     const response = await model.invoke(prompt);

//     res.json({ reply: response.content });
//   } catch (error) {
//     console.error("Chat Error:", error);
//     res.status(500).json({ reply: "I'm having trouble understanding. Please try again later." });
//   }
// };

// import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import Product from "../models/Product.js";
// import dotenv from "dotenv";

// dotenv.config();

// export const chatWithBot = async (req, res) => {
//   try {
//     const { message } = req.body;

//     // 1. API Key Check
//     if (!process.env.GEMINI_API_KEY) {
//       console.error("ERROR: GEMINI_API_KEY is missing in .env");
//       return res.status(500).json({ reply: "API Key configure nahi hai." });
//     }

//     // 2. Fetch Data from MongoDB
//     const products = await Product.find({});
//     if (!products || products.length === 0) {
//       return res.json({ reply: "Filhal hamare paas koi products listed nahi hain." });
//     }

//     const productDataString = products.map(p => 
//       `Product: ${p.name} | Price: Rs.${p.price} | Category: ${p.category} | Description: ${p.description}`
//     ).join("\n\n");

//     // 3. Document Splitting
//     const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
//     const docs = await splitter.createDocuments([productDataString]);

//     // 4. Vector Store (Memory)
//     const vectorStore = await MemoryVectorStore.fromDocuments(
//       docs,
//       new GoogleGenerativeAIEmbeddings({ 
//         apiKey: process.env.GEMINI_API_KEY,
//         modelName: "embedding-001"
//       })
//     );

//     // 5. Initialize Model
//     const model = new ChatGoogleGenerativeAI({
//       apiKey: process.env.GEMINI_API_KEY,
//       modelName: "gemini-1.5-flash",
//     });

//     // 6. Retrieval and Response
//     const retriever = vectorStore.asRetriever();
//     const relevantDocs = await retriever.invoke(message);
//     const context = relevantDocs.map(d => d.pageContent).join("\n");

//     const systemPrompt = `You are a helpful customer assistant for Atelier jewelry store.
//     Use the context below to answer:
//     ${context}
    
//     Question: ${message}`;

//     const response = await model.invoke(systemPrompt);

//     res.json({ reply: response.content });

//   } catch (error) {
//     // Ye console message terminal mein check karein
//     console.error("--- RUNTIME ERROR DEBUG ---");
//     console.error("Message:", error.message);
//     console.error("Stack:", error.stack);
    
//     res.status(500).json({ 
//       reply: "I'm having trouble thinking. Please check the terminal logs.",
//       debug: error.message 
//     });
//   }
// };


import Product from "../models/Product.js";

export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Say something!" });

    const lowerMessage = message.toLowerCase().trim();

    // 1. Dynamic Greetings
    const greetings = ["hi", "hello", "hey", "salam", "aoa", "good morning", "good afternoon", "good evening", "okay"];
    if (greetings.some(g => lowerMessage === g || lowerMessage.startsWith(g + " "))) {
      return res.json({ 
        reply: "Hello! Welcome to Atelier. I can help you find Rings, Earings, or any other jewelry. What are you looking for today?" 
      });
    }

   
    const products = await Product.find({})
  .populate('category')
  .populate('currentOffer');

    // 3. Smart Matching
    const foundProducts = products.filter(p => {
      const productName = String(p.name || "").toLowerCase();
      const categoryName = String(p.category?.name || "").toLowerCase();
      
      return (
        lowerMessage.includes(productName) || 
        (categoryName !== "" && lowerMessage.includes(categoryName)) ||
        (categoryName !== "" && lowerMessage.includes(categoryName.replace(/s$/, "")))
      );
    });

    // 4. Response Building
    if (foundProducts.length > 0) {
      const uniqueResults = foundProducts.slice(0, 5);
      
      let replyHeader = `I found some items for you:\n\n`;
      
      const details = uniqueResults.map(p => {
  const price = p.price || "Contact us";
  const stock = p.stock || 0;
  

  let offerText = "No active offer";
  
  const offer = p.currentOffer; 

  if (offer && offer.isActive === true) {
    const discount = offer.discountPercentage || 0;
    const offerName = offer.name || "Special Sale";
    
   
    const endDate = offer.endDate ? new Date(offer.endDate).toLocaleDateString('en-GB') : "Limited Time";
    
    offerText = `🔥 **${offerName.toUpperCase()}** - ${discount}% OFF (Ends: ${endDate})`;
  }

  return `• **${p.name}**\n\n
  💰 *Price:* Rs. ${price}\n\n
  📦 *Available:* ${stock} in stock\n\n
  🎨 *Colors:* ${p.colors?.join(", ") || 'N/A'}\n\n
  🎁 *Offer:* ${offerText}\n\n`;
}).join("\n\n--------\n\n");

      return res.json({ reply: replyHeader + details });
    }

    res.json({ 
      reply: `I couldn't find any products matching your request. Try asking 'show me rings', 'earings', 'necklaces', 'bracelets' or 'pendents'.` 
    });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ reply: "Technical issue: " + error.message });
  }
};