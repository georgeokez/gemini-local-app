const { VertexAI } = require("@google-cloud/vertexai");

const vertex_ai = new VertexAI({
  project: "germini-project-432311",
  location: "us-central1",
});
const model = "gemini-1.5-pro-001";

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 0.95,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
});

async function generateContent() {
  const prompt = `I need to gather real-time, accurate holiday destination suggestions from reliable sources based on my unique travel requirements for the purpose of data analysis. Imagine an expert travel agent who knows where and how to find the best holiday destinations is gathering the data for me and an expert software engineer is converting this data into JSON format, camel case. 

The output fields that I need are country, city, holiday type, accommodation type, the activities that I can go on while I’m there, whether or not the holiday is child friendly, the temperature in Celsius, the average flight duration, the flight costs and the estimated complete cost. 

When searching for flights, the travel agent will use proper IATA codes and not just the first three letters of the cities I’m traveling from and to.

For each destination suggestion found, the travel agent will cite the URLs for the flights, activities and accommodation. The travel agents will test these URLs before suggesting them and if any error is returned or if the content of the page indicates a problem, the agents will find the next best URL for the same suggestion.

As mentioned, please provide answers in JSON format that can be used in python code. Use camel case. The software engineer will name the JSON fields as country, city, holidayType, activities, childFriendly, temperature, flightDuration, flightCost, estimatedTotalCost, flightUrl, activitiesUrl, accommodationUrl. They will not include human readable results. 

If the travel agent cannot find 5 suggestions, the software engineer will list however many suggestions were found in JSON format as defined above. The software engineer will not add extra human readable text. 


My travel requirements are:  I want a holiday for 2-3 days with my solo including 1 adult(s) and 0 children. I  want to travel from Liverpool with Australian passports.  I want the type of trip to be adventure and/or activity and I want it to be located in nature and/or island.  I want the temperature to be warm or blazing hot and I want the break to be in August or September.  I don’t want to include Abondance, Bormio or Ronda as a destination.`;

  const req = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  const streamingResp = await generativeModel.generateContentStream(req);

  const modelResponse = await streamingResp.response;

  console.log(
    "Gemini Response: ",
    modelResponse["candidates"][0]["content"]["parts"][0]["text"]
  );
}

generateContent();
