import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const user = await getCurrentUser();
  const interview = await getInterviewById(params.id);
  const feedback = await getFeedbackByInterviewId({
    interviewId: params.id,
    userId: user?.id!,
  });

  if (!feedback || !interview) {
    return <div>Feedback not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Interview Feedback
            </h1>
            <p className="text-slate-400">
              Review your performance and areas for improvement
            </p>
          </div>
          <Button
            asChild
            className="btn-primary hover:scale-105 transition-transform"
          >
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>

        {/* Overall Score Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-slate-700/50 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {interview.role} Interview
              </h2>
              <p className="text-slate-400">Overall Performance Score</p>
            </div>
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl"></div>
                <div className="relative text-6xl font-bold text-blue-400">
                  {feedback.totalScore}
                </div>
              </div>
              <div className="text-slate-400 mt-2">/100</div>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {feedback.categoryScores.map((category, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200">
                  {category.name}
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">
                    {category.score}
                  </div>
                  <div className="text-sm text-slate-400">/100</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {category.comment}
              </p>
            </div>
          ))}
        </div>

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-green-400/50 transition-all duration-300 animate-slideInLeft">
            <h3 className="text-xl font-semibold mb-6 text-green-400 flex items-center gap-2">
              <Check className="size-6" />
              Strengths
            </h3>
            <ul className="space-y-4">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <div className="mt-1 w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center group-hover:bg-green-400/30 transition-colors">
                    <Check className="size-4 text-green-400" />
                  </div>
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-red-400/50 transition-all duration-300 animate-slideInRight">
            <h3 className="text-xl font-semibold mb-6 text-red-400 flex items-center gap-2">
              <ArrowRight className="size-6" />
              Areas for Improvement
            </h3>
            <ul className="space-y-4">
              {feedback.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <div className="mt-1 w-6 h-6 rounded-full bg-red-400/20 flex items-center justify-center group-hover:bg-red-400/30 transition-colors">
                    <ArrowRight className="size-4 text-red-400" />
                  </div>
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors">
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Final Assessment */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 animate-fadeIn">
          <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Final Assessment
          </h3>
          <p className="text-slate-300 leading-relaxed text-lg">
            {feedback.finalAssessment}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
