export const config = {
  runtime: 'edge',
};

const AI_TRIP_PLANNER_SYSTEM_PROMPT = `You are "AI Trip Planner Assistant", an intelligent travel planning chatbot.

Your goal is to help users plan trips by providing accurate, organized, and user-friendly travel information.

When a user asks a travel-related question, understand their requirements and generate a personalized response.

If the user does not provide enough information (budget, destination, number of days, travelers, etc.), politely ask for the missing details.

For complete trip requests, always respond in the following format:

🌍 Destination:
Display the destination name.

📅 Duration:
Mention the number of days.

📝 Trip Overview:
Give a short summary of the trip.

💰 Budget Breakdown:
• Transportation
• Hotel
• Food
• Activities
• Miscellaneous
• Total Estimated Cost

🗓️ Day-wise Itinerary:
Day 1:
- Morning
- Afternoon
- Evening

Day 2:
...

🏨 Hotel Recommendations:
Recommend 3 hotels with:
- Name
- Approximate Price
- Rating
- Location

📍 Top Attractions:
List the best tourist attractions.

🍴 Local Food:
Suggest famous local dishes.

🎒 Packing Essentials:
Recommend items based on weather and destination.

🌦️ Weather:
Provide expected weather information.

🚕 Local Transportation:
Suggest transport options.

💡 Travel Tips:
Provide useful travel advice.

🎯 Nearby Attractions:
Suggest nearby places worth visiting.

Finish every response with:

"Would you like to explore Hotels, Attractions, Weather, Budget Estimation, or Packing List?"

Rules:
- Be polite and conversational.
- Use bullet points wherever possible.
- Keep information realistic.
- Never leave sections empty.
- If the user asks only one thing (for example hotels or weather), answer only that topic.
- If the destination is unknown, suggest 3 suitable destinations based on the user's interests and budget.
- If the user changes the destination or budget, generate a completely new travel plan.`;

const PHI_3_MODEL = process.env.PHI3_MODEL || "microsoft/Phi-3-mini-4k-instruct";

function buildPhi3Prompt(message) {
  return `You are an expert global travel planner. Answer the user's travel request in a concise but rich travel-planning format. Use the destination they mention, and if it is a place like a temple, beach, hill station, heritage site, or city, include relevant attractions, food, local culture, packing tips, transport suggestions, and a simple itinerary. Do not mention that you are limited to a small list of places. If the user asks for a place, answer as if you know it well.\n\nUser request: ${message}`;
}

async function callPhi3Model(message) {
  const token = process.env.HF_API_TOKEN || process.env.HUGGINGFACE_API_TOKEN;
  if (!token) {
    return null;
  }

  const response = await fetch(`https://api-inference.huggingface.co/models/${PHI_3_MODEL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      inputs: buildPhi3Prompt(message),
      parameters: {
        max_new_tokens: 900,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Phi-3 API Error: ${errorText}`);
  }

  const data = await response.json();
  const generatedText = Array.isArray(data)
    ? data[0]?.generated_text || ""
    : data?.generated_text || "";

  return generatedText.replace(buildPhi3Prompt(message), "").trim();
}

function buildFallbackReply(message) {
  const destinationMatch = message.match(/(?:to|for|in|visit|trip\s+to)\s+([a-zA-Z][a-zA-Z\s.-]{1,40})/i);
  const destination = destinationMatch ? destinationMatch[1].trim() : "your destination";

  return `🌍 Destination: ${destination}\n\n📅 Suggested plan: 3-5 days with local sightseeing, food, and cultural stops.\n\n🏛️ Highlights: temples, heritage sites, beaches, hill stations, or city attractions depending on the place.\n\n🍴 Food: try local specialties and popular street food.\n\n🎒 Packing: comfortable shoes, charger, ID proof, light clothes, and weather-ready items.\n\nWould you like a more detailed itinerary for ${destination}?`;
}

export default async function reqHandler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const data = await req.json();
    const message = (data.message || "").trim();
    if (!message) {
      return new Response(JSON.stringify({ error: "Please enter a travel question." }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const phiReply = await callPhi3Model(message);
      if (phiReply) {
        return new Response(JSON.stringify({
          model: PHI_3_MODEL,
          reply: phiReply
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (modelError) {
      console.error(modelError);
    }

    return new Response(JSON.stringify({
      model: "built-in-fallback",
      reply: buildFallbackReply(message)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: `Server error: ${error.message}` }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
