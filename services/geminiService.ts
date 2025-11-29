import { GoogleGenAI, Schema, Type } from "@google/genai";
import { EventDetails, Group, Participant, Question } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuestionnaire = async (details: EventDetails): Promise<Question[]> => {
  const ai = createClient();
  const modelId = "gemini-2.5-flash";

  const prompt = `
    You are an expert organizational psychologist and event planner.
    Create a questionnaire to help form optimal teams for the following event:
    
    Event Name: ${details.eventName}
    Context: ${details.context}
    Target Group Size: ${details.groupSize}
    Matching Rules: ${details.matchingRules}
    Mandatory Topics: ${details.mandatoryTopics}
    Philosophy: ${details.matchingPhilosophy}

    Generate 5-8 insightful questions that will reveal the necessary traits to follow the matching rules.
    Include a mix of scale (1-10), multiple choice, and open text questions.
    Ensure questions are clear and concise.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        text: { type: Type.STRING, description: "The question text" },
        type: { type: Type.STRING, enum: ["text", "scale", "choice", "boolean"] },
        options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Options for choice type questions" }
      },
      required: ["text", "type"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a helpful AI assistant that generates structured JSON data.",
        temperature: 0.7,
      },
    });

    const rawQuestions = JSON.parse(response.text || "[]");
    return rawQuestions.map((q: any, index: number) => ({
      ...q,
      id: `q-${index}-${Date.now()}`
    }));
  } catch (error) {
    console.error("Error generating questionnaire:", error);
    throw new Error("Failed to generate questionnaire. Please check your inputs and try again.");
  }
};

export const generateMockParticipants = async (
  count: number,
  questions: Question[],
  details: EventDetails
): Promise<Participant[]> => {
  // Local generation logic to remove API request
  const names = [
    "Alex Rivera", "Jordan Lee", "Taylor Smith", "Morgan Chen", "Casey Kim",
    "Riley Patel", "Jamie Wilson", "Quinn Davis", "Avery Johnson", "Peyton Brown",
    "Sam Garcia", "Pat Martinez", "Drew Robinson", "Skyler White", "Reese Clark",
    "Cameron Lewis", "Dakota Hall", "Eden Scott", "Finley Young", "Gray Adams"
  ];

  // UPDATED: Generic personality-based answers that fit any theme (Star Wars, Corporate, Hackathon)
  const genericTextAnswers = [
    "I trust my instincts and prefer to act immediately rather than over-plan.",
    "I analyze the situation logically and need to understand the mechanics before moving.",
    "I focus on protecting the team and ensuring everyone stays together.",
    "I am ambitious and willing to take high risks to achieve the ultimate goal.",
    "I prefer diplomacy and negotiation to resolve conflicts.",
    "I am independent and often prefer to work on my own tasks.",
    "I value tradition, structure, and following the established code.",
    "I am curious and always looking for creative, unconventional solutions."
  ];

  // Simulate a short delay for better UX
  await new Promise(resolve => setTimeout(resolve, 600));

  return Array.from({ length: count }).map((_, idx) => {
    const name = names[idx % names.length] + (idx >= names.length ? ` ${idx}` : "");
    const answers: Record<string, string> = {};

    questions.forEach(q => {
      if (q.type === 'scale') {
        // Random 1-10
        answers[q.id] = Math.floor(Math.random() * 10 + 1).toString();
      } else if (q.type === 'boolean') {
        answers[q.id] = Math.random() > 0.5 ? "Yes" : "No";
      } else if (q.type === 'choice' && q.options && q.options.length > 0) {
        answers[q.id] = q.options[Math.floor(Math.random() * q.options.length)];
      } else {
        answers[q.id] = genericTextAnswers[Math.floor(Math.random() * genericTextAnswers.length)];
      }
    });

    return {
      id: `p-${idx}-${Date.now()}`,
      name,
      answers
    };
  });
};

export const generateGroups = async (
  details: EventDetails,
  questions: Question[],
  participants: Participant[]
): Promise<Group[]> => {
  const ai = createClient();
  const modelId = "gemini-2.5-flash";

  const participantsData = participants.map(p => ({
    id: p.id,
    name: p.name,
    answers: p.answers
  }));

  const questionsData = questions.map(q => ({
    id: q.id,
    text: q.text
  }));

  const prompt = `
    Task: Form optimal teams for an event based on participant answers.
    
    Event Details:
    - Name: ${details.eventName}
    - Context: ${details.context}
    - Target Group Size: ${details.groupSize}
    - Matching Rules: ${details.matchingRules}
    - Philosophy: ${details.matchingPhilosophy}

    Questions Asked:
    ${JSON.stringify(questionsData, null, 2)}

    Participants & Answers:
    ${JSON.stringify(participantsData, null, 2)}

    Instructions:
    1. Analyze every participant's profile.
    2. Group them according to the target size and matching rules.
    3. Provide a clear justification for each group explaining why these people fit together.
    4. List specific strengths and potential risks for each group.
    5. Assign a compatibility score (0-100).
    6. Assign a Role or Character Archetype to each member that specifically fits the theme of "${details.eventName}" (Context: ${details.context}). 
       - Example: If the event is "Star Wars", assign characters like "Jedi Guardian", "Smuggler", "Droid", "Sith Apprentice".
       - Example: If the event is a "Hackathon", assign roles like "Hacker", "Designer", "Pitcher".
       - Be creative and stick to the requested theme!
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Creative team name based on the event theme" },
        members: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Must match participant ID" },
              name: { type: Type.STRING },
              role: { type: Type.STRING, description: "Assigned role or character in group" },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "name"]
          }
        },
        justification: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        risks: { type: Type.ARRAY, items: { type: Type.STRING } },
        compatibilityScore: { type: Type.NUMBER }
      },
      required: ["name", "members", "justification", "compatibilityScore"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.5, // Balanced for logical grouping
      },
    });

    const groups = JSON.parse(response.text || "[]");
    return groups.map((g: any, idx: number) => ({
        ...g,
        id: `g-${idx}-${Date.now()}`
    }));

  } catch (error) {
    console.error("Error generating groups:", error);
    throw new Error("Failed to form groups. Please try again.");
  }
};