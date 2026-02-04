"use client";

import { useState, useEffect, useRef } from "react";

export default function WorkBreakTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Дуу тоглуулах
          if (audioRef.current) {
            audioRef.current.play();
          }

          // Notification харуулах
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification(isBreak ? "Ажилдаа орцгооё! 💪" : "Амрах цаг! ☕");
          }

          if (isBreak) {
            setIsBreak(false);
            return 25 * 60;
          } else {
            setIsBreak(true);
            return 5 * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isBreak]);

  // Notification зөвшөөрөл авах
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Дуу (Browser-т аудио файл хэрэгтэй) */}
      <audio ref={audioRef} src="/notification.mp3" />

      {/* Үндсэн контент */}
      <div
        className={`h-full w-full p-8 transition-all ${isBreak ? "blur-sm" : ""}`}
      >
        <h1 className="text-3xl font-bold mb-4">Work Break Timer 🍅</h1>
        <p className="text-gray-600 mb-8">25 минут ажилла → 5 минут амрана</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📝 Хийх ажил</h2>
            <textarea
              className="w-full border rounded p-2 h-32"
              placeholder="1. Код бичих..."
              disabled={isBreak}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">✅ Хийсэн</h2>
            <ul className="space-y-2">
              <li className="text-gray-600">• Дизайн хийсэн</li>
              <li className="text-gray-600">• API холбосон</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Break overlay */}
      {isBreak && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center text-white">
            <div className="text-8xl mb-6 animate-bounce">☕</div>
            <h2 className="text-5xl font-bold mb-4">Амралтын цаг!</h2>
            <p className="text-7xl font-mono mb-8 font-bold">
              {formatTime(timeLeft)}
            </p>
            <p className="text-2xl text-gray-300 max-w-md">
              Босоод алхаарай, ус уугаарай, эсвэл суралцах зүйл үзээрэй
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <div className="bg-white/10 px-6 py-3 rounded-lg">💧 Ус уух</div>
              <div className="bg-white/10 px-6 py-3 rounded-lg">🚶 Алхах</div>
              <div className="bg-white/10 px-6 py-3 rounded-lg">
                👀 Нүд амраах
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timer panel */}
      <div className="fixed bottom-8 right-8 bg-white p-6 rounded-2xl shadow-2xl border-2 border-gray-200 z-40">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{isBreak ? "🛌" : "💪"}</div>
          <p className="text-sm font-semibold text-gray-500 mb-2">
            {isBreak ? "АМРАЛТ" : "АЖИЛ"}
          </p>
          <p className="text-5xl font-mono font-bold text-gray-800">
            {formatTime(timeLeft)}
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              ▶ Эхлүүлэх
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              ⏸ Зогсоох
            </button>
          )}
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            ↻
          </button>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                isBreak ? "bg-blue-500" : "bg-green-500"
              }`}
              style={{
                width: `${
                  (((isBreak ? 5 * 60 : 25 * 60) - timeLeft) /
                    (isBreak ? 5 * 60 : 25 * 60)) *
                  100
                }%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            {Math.round(
              (((isBreak ? 5 * 60 : 25 * 60) - timeLeft) /
                (isBreak ? 5 * 60 : 25 * 60)) *
                100,
            )}
            % дууссан
          </p>
        </div>
      </div>
    </div>
  );
}
