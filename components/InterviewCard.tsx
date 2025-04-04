import dayjs from "dayjs";
import Link from "next/link";
import { PlayIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Calendar, Star } from "lucide-react";
import * as Icons from "lucide-react";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import Image from "next/image";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  coverImage,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-blue-500/20 text-blue-400",
      Mixed: "bg-purple-500/20 text-purple-400",
      Technical: "bg-cyan-500/20 text-cyan-400",
    }[normalizedType] || "bg-purple-500/20 text-purple-400";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96 group">
      <div className="card-interview">
        <div className="relative">
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-4 right-4 w-fit px-4 py-2 rounded-xl border border-current/20 backdrop-blur-sm",
              badgeColor
            )}
          >
            <p className="badge-text text-sm font-medium">{normalizedType}</p>
          </div>

          {/* Cover Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-full blur-xl opacity-70 transition-all duration-300 cover-image-glow"></div>
            <div className="relative rounded-full size-[90px] border-2 border-cyan-500/20 transition-all duration-300 cover-image-border flex items-center justify-center">
              {(() => {
                // Default to Code2 if no icon is specified
                const iconName = coverImage || "Code2";

                // Use a switch statement to render the appropriate icon
                switch (iconName) {
                  case "Briefcase":
                    return <Icons.Briefcase className="size-8 text-cyan-400" />;
                  case "GraduationCap":
                    return (
                      <Icons.GraduationCap className="size-8 text-cyan-400" />
                    );
                  case "Code2":
                    return <Icons.Code2 className="size-8 text-cyan-400" />;
                  case "Brain":
                    return <Icons.Brain className="size-8 text-cyan-400" />;
                  case "Lightbulb":
                    return <Icons.Lightbulb className="size-8 text-cyan-400" />;
                  default:
                    return <Icons.Code2 className="size-8 text-cyan-400" />;
                }
              })()}
            </div>
          </div>

          {/* Interview Role */}
          <h3 className="mt-6 text-xl font-semibold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent capitalize group-hover:from-blue-300 group-hover:via-cyan-300 group-hover:to-purple-300 transition-all duration-300">
            {role} Interview
          </h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mt-4">
            <div className="flex flex-row gap-2 items-center text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
              <div className="p-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 group-hover:bg-slate-800/70 group-hover:border-slate-700/70 transition-all duration-300">
                <Calendar className="size-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-sm">{formattedDate}</span>
            </div>

            <div className="flex flex-row gap-2 items-center text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
              <div className="p-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 group-hover:bg-slate-800/70 group-hover:border-slate-700/70 transition-all duration-300">
                <Star className="size-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-sm">
                {feedback?.totalScore || "---"}
                <span className="text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                  /100
                </span>
              </span>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-6 text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center mt-6">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary group">
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-white-400 font-bold">
                  {feedback ? "View Feedback" : "Start Interview"}
                </span>
                {feedback ? (
                  <ArrowRightIcon className="w-4 h-4 text-white-400 transition-transform duration-300 group-hover:translate-x-1" />
                ) : (
                  <PlayIcon className="w-4 h-4 text-white-400 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
