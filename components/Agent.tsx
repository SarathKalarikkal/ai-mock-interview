"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const handleGenerateFeedback = useCallback(
    async (messages: SavedMessage[]) => {
      console.log("Starting feedback generation...");
      console.log("Messages:", messages);
      console.log("Interview ID:", interviewId);
      console.log("User ID:", userId);

      if (!interviewId || !userId) {
        console.error("Missing required parameters:", { interviewId, userId });
        router.push("/");
        return;
      }

      try {
        const { success, feedbackId: id } = await createFeedback({
          interviewId,
          userId,
          transcript: messages,
          feedbackId,
        });

        console.log("Feedback generation result:", { success, id });

        if (success && id) {
          console.log("Redirecting to feedback page...");
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          console.error("Failed to generate feedback");
          router.push("/");
        }
      } catch (error) {
        console.error("Error in handleGenerateFeedback:", error);
        router.push("/");
      }
    },
    [interviewId, userId, feedbackId, router]
  );

  useEffect(() => {
    const onCallStart = () => {
      console.log("Call started");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("Call ended");
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("VAPI Error:", error);
    };

    // Register event listeners
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    // Cleanup function
    return () => {
      console.log("Cleaning up event listeners");
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    if (callStatus === CallStatus.FINISHED) {
      console.log("Call finished, checking type:", type);
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, router, handleGenerateFeedback]);

  useEffect(() => {
    if (callStatus === "ACTIVE") {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          const videoTrack = stream.getVideoTracks()[0];
          const audioTrack = stream.getAudioTracks()[0];
          if (videoTrack) setVideoEnabled(videoTrack.enabled);
          if (audioTrack) setAudioEnabled(audioTrack.enabled);
        })
        .catch((err) => console.error("Error accessing media:", err));

      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [callStatus]);

  const handleCall = async () => {
    try {
      console.log("Starting call...");
      setCallStatus(CallStatus.CONNECTING);

      if (type === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log("Disconnecting call...");
      await vapi.stop();
      setCallStatus(CallStatus.FINISHED);
      console.log("Call disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/AI.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <div className="relative w-full h-[340px] bg-slate-900 rounded-lg overflow-hidden">
              {callStatus === "INACTIVE" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/user.png"
                    alt="user"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    id="userVideo"
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      onClick={toggleVideo}
                      className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                    >
                      {videoEnabled ? (
                        <Video className="w-5 h-5 text-white" />
                      ) : (
                        <VideoOff className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <button
                      onClick={toggleAudio}
                      className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                    >
                      {audioEnabled ? (
                        <Mic className="w-5 h-5 text-white" />
                      ) : (
                        <MicOff className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </>
              )}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-white font-medium">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-2">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
