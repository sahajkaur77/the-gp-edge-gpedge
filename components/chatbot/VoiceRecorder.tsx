"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

interface VoiceRecorderProps {
  onTranscript: (value: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(" ");
      if (transcript) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };

    recognitionRef.current = recognition;

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [onTranscript]);

  const startTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => setElapsed((value) => value + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      stopTimer();
      return;
    }

    setElapsed(0);
    setIsRecording(true);
    startTimer();
    recognitionRef.current.start();
  };

  const formatTime = (value: number) => {
    const mins = String(Math.floor(value / 60)).padStart(2, "0");
    const secs = String(value % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <span className="rounded-full bg-[#0d9488]/10 px-3 py-1.5 text-sm font-medium text-[#0d9488]">
          {formatTime(elapsed)} • Listening...
        </span>
      ) : null}

      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
          isRecording
            ? "bg-red-500 text-white shadow-lg shadow-red-500/20 animate-pulse"
            : "bg-[#0d9488] text-white shadow-lg shadow-[#0d9488]/20 hover:scale-105 hover:bg-[#0b7a6f] active:scale-95"
        }`}
      >
        {isRecording ? <Square size={16} /> : <Mic size={16} />}
      </button>
    </div>
  );
}
