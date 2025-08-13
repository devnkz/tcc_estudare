"use client";

import React, { useState } from "react";
import zxcvbn from "zxcvbn";

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    const result = zxcvbn(value);
    setScore(result.score);
    setFeedback(result.feedback.suggestions.join(" ") || "Senha forte!");
  };

  const getStrengthColor = () => {
    switch (score) {
      case 0:
        return "bg-purple-200";
      case 1:
        return "bg-purple-300";
      case 2:
        return "bg-purple-400";
      case 3:
        return "bg-purple-500";
      case 4:
        return "bg-purple-600";
      default:
        return "bg-purple-200";
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        Verificador de Força da Senha
      </h1>

      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Digite sua senha"
        className="w-full border border-purple-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="w-full h-3 rounded-full bg-purple-100 overflow-hidden mb-2">
        <div
          className={`h-full ${getStrengthColor()} transition-all`}
          style={{ width: `${(score + 1) * 20}%` }}
        ></div>
      </div>

      <p className="text-sm text-purple-600">{feedback}</p>
    </div>
  );
}
