import { getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Agent from "@/components/Agent";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const user = await getCurrentUser();
  const interview = await getInterviewById(params.id);

  if (!interview) {
    console.error("Interview not found for ID:", params.id);
    return <div>Interview not found</div>;
  }

  if (!user) {
    console.error("User not found");
    return <div>Please log in to continue</div>;
  }

  console.log("Rendering interview page with:", {
    interviewId: params.id,
    userId: user.id,
    role: interview.role,
  });

  return (
    <div className=" bg-gradient-to-b from-slate-900  rounded-2xl">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {interview.role} Interview
            </h1>
            <p className="text-slate-400 mt-2">
              Practice your interview skills with AI
            </p>
          </div>
        </div>

        <Agent
          userName={user.name || ""}
          userId={user.id}
          interviewId={params.id}
          type="interview"
          questions={interview.questions}
        />
      </div>
    </div>
  );
};

export default Page;
