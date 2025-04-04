import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { interviewCovers } from "@/constants";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  console.log("Received interview generation request:", {
    type,
    role,
    level,
    techstack,
    amount,
    userid,
  });

  try {
    console.log("Generating questions using Gemini model...");
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    console.log("Generated questions:", questions);

    const randomIndex = Math.floor(Math.random() * interviewCovers.length);
    const iconName = interviewCovers[randomIndex];

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: iconName,
      createdAt: new Date().toISOString(),
    };

    console.log("Saving interview to database:", interview);
    await db.collection("interviews").add(interview);
    console.log("Interview saved successfully");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in interview generation:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
