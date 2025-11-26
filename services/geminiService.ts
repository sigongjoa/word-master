
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

const COMMON_SYSTEM_INSTRUCTION = `
  Role: 당신은 초등학교 5학년 아이들을 위한 베스트셀러 동화 작가이자 TRPG 게임 마스터입니다.
  Target Audience: 초등학교 5학년 (12세).
  Tone: 흥미진진하고, 몰입감 넘치며, 선택한 장르의 특징을 잘 살리는 어투.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The title of the current chapter." },
    story: { type: Type.STRING, description: "The full text of the story with markdown bolding for keywords." },
    quizzes: {
      type: Type.ARRAY,
      description: "3 quiz questions based strictly on THIS NEW chapter.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "The question text, usually with a blank ( ? )." },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 distinct options."
          },
          correctAnswerIndex: { type: Type.INTEGER, description: "The index (0-2) of the correct option." }
        },
        required: ["question", "options", "correctAnswerIndex"]
      }
    }
  },
  required: ["title", "story", "quizzes"]
};

export const generateStoryAndQuiz = async (input: UserInput): Promise<GeneratedContent> => {
  const { name, genre, words } = input;
  const wordsString = words.join(', ');

  const prompt = `
    Task:
    사용자가 입력한 정보로 흥미진진한 짧은 소설(600자~800자 내외)의 **제1장**과 독해 퀴즈를 작성하세요.

    Input Data:
    - 주인공 이름: ${name}
    - 장르: ${genre}
    - 학습 단어: ${wordsString}

    Story Constraints:
    1. 각 '학습 단어'는 소설 속에서 **최소 2번 이상** 자연스럽게 반복 등장해야 합니다.
    2. 단어의 사전적 정의를 설명하려 하지 말고, **문맥 속에서 그 쓰임새를 알 수 있게** 상황을 묘사하세요.
    3. 문체는 선택된 장르(${genre})의 클리셰를 적극 활용하여 아이가 몰입하게 하세요.
    4. 소설 본문 내에서 학습 단어가 등장할 때는 반드시 **(볼드체)** 표시를 위해 별표 두 개(**)로 감싸주세요. 예: **추상화**

    Quiz Constraints:
    1. 소설 내용을 바탕으로 한 빈칸 채우기 문제 3개를 만드세요.
    2. 각 문제는 학습 단어의 의미나 문맥적 쓰임새를 묻는 문제입니다.

    Output Format:
    JSON Schema를 준수하여 출력하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: COMMON_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    }
    throw new Error("No response text generated.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      title: "오류가 발생한 던전",
      story: "던전의 입구가 무너져서 이야기를 불러올 수 없습니다. 다시 시도해주세요.",
      quizzes: []
    };
  }
};

export const continueStory = async (
  input: UserInput, 
  previousStory: string, 
  userPrompt: string
): Promise<GeneratedContent> => {
  const { name, genre, words } = input;
  
  const prompt = `
    Task:
    이전 이야기에 이어지는 **다음 챕터**를 작성하세요.
    사용자(주인공)가 직접 행동(Action)을 입력했습니다. 이 내용을 이야기에 적극적으로 반영하세요.

    Current Context:
    - 주인공: ${name}
    - 장르: ${genre}
    - 학습 단어(Goal): ${words.join(', ')} (이야기 흐름에 맞으면 다시 사용해도 좋습니다)
    - 이전 줄거리 요약: ${previousStory.slice(-1500)} ... (생략)
    
    User Action (Driver): "${userPrompt}"

    Story Constraints:
    1. 사용자의 행동("${userPrompt}")이 이야기의 전개를 바꿉니다. 결과가 성공일 수도, 실패일 수도 있습니다.
    2. 분량은 500자~700자 내외로 작성하세요.
    3. 학습 단어가 자연스럽게 들어갈 수 있다면 다시 활용하고, **(볼드체)** 처리하세요.
    4. 이야기는 끝내지 말고, 다음 모험이 기대되게 마무리하세요.

    Quiz Constraints:
    1. **오직 방금 작성한 이 새로운 챕터**의 내용을 바탕으로 퀴즈 3개를 만드세요.
    
    Output Format:
    JSON Schema를 준수하여 출력하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: COMMON_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    }
    throw new Error("No response text generated.");
  } catch (error) {
    console.error("Gemini API Continue Error:", error);
    return {
      title: "연결이 끊긴 차원",
      story: "마법의 힘이 부족하여 다음 이야기를 불러오지 못했습니다.",
      quizzes: []
    };
  }
};
