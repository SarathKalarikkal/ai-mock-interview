import InterViewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import { getCurrentUser, signOut } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Icons } from "@/components/icons";

const Page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (latestInterviews?.length ?? 0) > 0;

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-8 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Get Interview-Ready with AI-Powered Practice & Feedback
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Practice with real interview questions and receive instant,
              personalized feedback powered by advanced AI technology
            </p>
            <Button
              asChild
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1.5 text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl max-sm:w-full w-1/3"
            >
              <Link
                href="/interview"
                className="flex items-center gap-2 font-medium"
              >
                Start an Interview
                <Icons.ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur-3xl" />
            <Image
              src="/robot.png"
              alt="AI Interview Assistant"
              width={500}
              height={500}
              className="relative animate-float max-sm:hidden"
              priority
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Your Interviews
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-400 max-sm:hidden">
            <Icons.History className="h-4 w-4" />
            <span>Track your progress</span>
          </div>
        </div>

        {hasPastInterviews && userInterviews ? (
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row gap-8 relative">
              <div className="md:sticky md:top-24 md:self-start">
                <TabsList className="flex flex-col h-auto w-full md:w-56 bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700/50 shadow-lg">
                  <TabsTrigger
                    value="all"
                    className="w-full justify-start px-4 py-3 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:border-l-4 data-[state=active]:border-blue-400"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-blue-500/10">
                        <Icons.ListTodo className="h-5 w-5 text-blue-400" />
                      </div>
                      <span className="font-medium">All Interviews</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="technical"
                    className="w-full justify-start px-4 py-3 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border-l-4 data-[state=active]:border-purple-400"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-purple-500/10">
                        <Icons.Code2 className="h-5 w-5 text-purple-400" />
                      </div>
                      <span className="font-medium">Technical</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="behavioral"
                    className="w-full justify-start px-4 py-3 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-emerald-500/20 data-[state=active]:border-l-4 data-[state=active]:border-green-400"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-green-500/10">
                        <Icons.Users className="h-5 w-5 text-green-400" />
                      </div>
                      <span className="font-medium">Behavioral</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="mixed"
                    className="w-full justify-start px-4 py-3 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:border-l-4 data-[state=active]:border-amber-400"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-amber-500/10">
                        <Icons.Brain className="h-5 w-5 text-amber-400" />
                      </div>
                      <span className="font-medium">Mixed</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-lg">
                <TabsContent
                  value="all"
                  className="mt-0 data-[state=inactive]:hidden"
                >
                  <div className="interviews-section">
                    {userInterviews.length > 0 ? (
                      userInterviews.map((interview) => (
                        <InterViewCard
                          key={interview.id}
                          interviewId={interview.id}
                          userId={user?.id}
                          role={interview.role}
                          type={interview.type}
                          techstack={interview.techstack}
                          createdAt={interview.createdAt}
                          coverImage={interview.coverImage}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 rounded-full bg-slate-700/50 mb-4">
                          <Icons.Briefcase className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-medium text-slate-300 mb-2">
                          No interviews found
                        </h3>
                        <p className="text-slate-400 max-w-md">
                          You haven't taken any interviews yet. Start your first
                          interview to see your history here.
                        </p>
                        <Button asChild className="btn-primary mt-6">
                          <Link href="/interview">Start an Interview</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent
                  value="technical"
                  className="mt-0 data-[state=inactive]:hidden"
                >
                  <div className="interviews-section">
                    {userInterviews.filter(
                      (interview) =>
                        interview.type === "technical" ||
                        interview.type === "Technical"
                    ).length > 0 ? (
                      userInterviews
                        .filter(
                          (interview) =>
                            interview.type === "technical" ||
                            interview.type === "Technical"
                        )
                        .map((interview) => (
                          <InterViewCard
                            key={interview.id}
                            interviewId={interview.id}
                            userId={user?.id}
                            role={interview.role}
                            type={interview.type}
                            techstack={interview.techstack}
                            createdAt={interview.createdAt}
                            coverImage={interview.coverImage}
                          />
                        ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center w-full">
                        <div className="p-4 rounded-full bg-purple-500/10 mb-4">
                          <Icons.Code2 className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-medium text-slate-300 mb-2">
                          No technical interviews found
                        </h3>
                        <p className="text-slate-400 max-w-md">
                          You haven't taken any technical interviews yet. Start
                          one to see your history here.
                        </p>
                        <Button asChild className="btn-primary mt-6">
                          <Link href="/interview">
                            Start a Technical Interview
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent
                  value="behavioral"
                  className="mt-0 data-[state=inactive]:hidden"
                >
                  <div className="interviews-section">
                    {userInterviews.filter(
                      (interview) =>
                        interview.type === "behavioral" ||
                        interview.type === "Behavioral"
                    ).length > 0 ? (
                      userInterviews
                        .filter(
                          (interview) =>
                            interview.type === "behavioral" ||
                            interview.type === "Behavioral"
                        )
                        .map((interview) => (
                          <InterViewCard
                            key={interview.id}
                            interviewId={interview.id}
                            userId={user?.id}
                            role={interview.role}
                            type={interview.type}
                            techstack={interview.techstack}
                            createdAt={interview.createdAt}
                            coverImage={interview.coverImage}
                          />
                        ))
                    ) : (
                      <div className="w-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 rounded-full bg-green-500/10 mb-4">
                          <Icons.Users className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-medium text-slate-300 mb-2">
                          No behavioral interviews found
                        </h3>
                        <p className="text-slate-400 max-w-md">
                          You haven't taken any behavioral interviews yet. Start
                          one to see your history here.
                        </p>
                        <Button asChild className="btn-primary mt-6">
                          <Link href="/interview">
                            Start a Behavioral Interview
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent
                  value="mixed"
                  className="mt-0 data-[state=inactive]:hidden"
                >
                  <div className="interviews-section">
                    {userInterviews.filter(
                      (interview) =>
                        interview.type === "mixed" || interview.type === "Mixed"
                    ).length > 0 ? (
                      userInterviews
                        .filter(
                          (interview) =>
                            interview.type === "mixed" ||
                            interview.type === "Mixed"
                        )
                        .map((interview) => (
                          <InterViewCard
                            key={interview.id}
                            interviewId={interview.id}
                            userId={user?.id}
                            role={interview.role}
                            type={interview.type}
                            techstack={interview.techstack}
                            createdAt={interview.createdAt}
                            coverImage={interview.coverImage}
                          />
                        ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 rounded-full bg-amber-500/10 mb-4">
                          <Icons.Brain className="h-8 w-8 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-medium text-slate-300 mb-2">
                          No mixed interviews found
                        </h3>
                        <p className="text-slate-400 max-w-md">
                          You haven't taken any mixed interviews yet. Start one
                          to see your history here.
                        </p>
                        <Button asChild className="btn-primary mt-6">
                          <Link href="/interview">Start a Mixed Interview</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        ) : (
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-lg">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-slate-700/50 mb-4">
                <Icons.Briefcase className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-300 mb-2">
                No Past Interviews
              </h3>
              <p className="text-slate-400 max-w-md">
                You haven't taken any interviews yet. Start your first interview
                to see your history here.
              </p>
              <Button asChild className="btn-primary mt-6">
                <Link href="/interview">Start an Interview</Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
          Take an Interview
        </h2>

        {hasUpcomingInterviews && latestInterviews && (
          <>
            {/* Check if any interviews exist for each type */}
            {(() => {
              const hasTechnical =
                latestInterviews.filter(
                  (interview) => interview.type === "technical"
                ).length > 0;

              const hasBehavioral =
                latestInterviews.filter(
                  (interview) =>
                    interview.type === "behavioral" ||
                    interview.type === "Behavioral"
                ).length > 0;

              const hasMixed =
                latestInterviews.filter(
                  (interview) =>
                    interview.type === "mixed" || interview.type === "Mixed"
                ).length > 0;

              // If no interviews exist for any type, show a message
              if (!hasTechnical && !hasBehavioral && !hasMixed) {
                return (
                  <p className="text-slate-400">
                    No interviews available at the moment.
                  </p>
                );
              }

              // Determine default tab based on available content
              const defaultTab = hasTechnical
                ? "technical"
                : hasBehavioral
                ? "behavioral"
                : "mixed";

              return (
                <Tabs defaultValue={defaultTab} className="w-full">
                  <div className="flex flex-col md:flex-row gap-8 relative">
                    <div className="md:sticky md:top-24 md:self-start">
                      <TabsList className="flex flex-col h-auto w-full md:w-56 bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700/50 shadow-lg">
                        {hasTechnical && (
                          <TabsTrigger
                            value="technical"
                            className="w-full justify-start px-4 py-3 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:border-l-4 data-[state=active]:border-blue-400"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-md bg-blue-500/10">
                                <Icons.Code2 className="h-5 w-5 text-blue-400" />
                              </div>
                              <span className="font-medium">Technical</span>
                            </div>
                          </TabsTrigger>
                        )}

                        {hasBehavioral && (
                          <TabsTrigger
                            value="behavioral"
                            className="w-full justify-start px-4 py-3 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border-l-4 data-[state=active]:border-purple-400"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-md bg-purple-500/10">
                                <Icons.Users className="h-5 w-5 text-purple-400" />
                              </div>
                              <span className="font-medium">Behavioral</span>
                            </div>
                          </TabsTrigger>
                        )}

                        {hasMixed && (
                          <TabsTrigger
                            value="mixed"
                            className="w-full justify-start px-4 py-3 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-emerald-500/20 data-[state=active]:border-l-4 data-[state=active]:border-green-400"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-md bg-green-500/10">
                                <Icons.Brain className="h-5 w-5 text-green-400" />
                              </div>
                              <span className="font-medium">Mixed</span>
                            </div>
                          </TabsTrigger>
                        )}
                      </TabsList>
                    </div>

                    <div className="flex-1 bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-lg">
                      {hasTechnical && (
                        <TabsContent
                          value="technical"
                          className="mt-0 data-[state=inactive]:hidden"
                        >
                          <div className="interviews-section">
                            {latestInterviews
                              .filter(
                                (interview) => interview.type === "technical"
                              )
                              .map((interview) => (
                                <InterViewCard
                                  key={interview.id}
                                  interviewId={interview.id}
                                  userId={user?.id}
                                  role={interview.role}
                                  type={interview.type}
                                  techstack={interview.techstack}
                                  createdAt={interview.createdAt}
                                  coverImage={interview.coverImage}
                                />
                              ))}
                          </div>
                        </TabsContent>
                      )}

                      {hasBehavioral && (
                        <TabsContent
                          value="behavioral"
                          className="mt-0 data-[state=inactive]:hidden"
                        >
                          <div className="interviews-section">
                            {latestInterviews
                              .filter(
                                (interview) =>
                                  interview.type === "behavioral" ||
                                  interview.type === "Behavioral"
                              )
                              .map((interview) => (
                                <InterViewCard
                                  key={interview.id}
                                  interviewId={interview.id}
                                  userId={user?.id}
                                  role={interview.role}
                                  type={interview.type}
                                  techstack={interview.techstack}
                                  createdAt={interview.createdAt}
                                  coverImage={interview.coverImage}
                                />
                              ))}
                          </div>
                        </TabsContent>
                      )}

                      {hasMixed && (
                        <TabsContent
                          value="mixed"
                          className="mt-0 data-[state=inactive]:hidden"
                        >
                          <div className="interviews-section">
                            {latestInterviews
                              .filter(
                                (interview) =>
                                  interview.type === "mixed" ||
                                  interview.type == "Mixed"
                              )
                              .map((interview) => (
                                <InterViewCard
                                  key={interview.id}
                                  interviewId={interview.id}
                                  userId={user?.id}
                                  role={interview.role}
                                  type={interview.type}
                                  techstack={interview.techstack}
                                  createdAt={interview.createdAt}
                                  coverImage={interview.coverImage}
                                />
                              ))}
                          </div>
                        </TabsContent>
                      )}
                    </div>
                  </div>
                </Tabs>
              );
            })()}
          </>
        )}
      </section>
    </>
  );
};

export default Page;
