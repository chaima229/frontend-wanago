import React, { useRef, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const Validation = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Gère la saisie et le collage
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    let newCode = [...code];

    if (val.length === 1) {
      newCode[idx] = val;
      setCode(newCode);
      if (idx < 3) inputRefs.current[idx + 1]?.focus();
    } else if (val.length > 1) {
      // Collage de plusieurs chiffres
      val.split("").forEach((digit, i) => {
        if (idx + i < 4) newCode[idx + i] = digit;
      });
      setCode(newCode);
      const nextIdx = Math.min(idx + val.length, 3);
      inputRefs.current[nextIdx]?.focus();
    } else {
      newCode[idx] = "";
      setCode(newCode);
    }
  };

  // Gère le backspace pour revenir à la case précédente
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (code[idx] === "" && idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setMessage("Vous devez être connecté.");
        setLoading(false);
        return;
      }
      await axios.post("http://localhost:5000/api/users/validate", {
        uid: user.uid,
        code: code.join(""),
      });
      setMessage("Votre compte a été validé avec succès !");
      navigate("/");
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "Erreur lors de la validation du code."
      );
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <img
        src="/wanaGO.webp"
        alt="WanaGO Logo"
        className="w-32 mb-6"
      />
      <h2 className="text-3xl font-semibold mb-2">Entrez votre code</h2>
      <p className="mb-4 text-muted-foreground">
        Nous avons envoyé un code de sécurité à <span className="font-bold text-foreground">votre email</span>.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-xs">
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <input
              key={idx}
              id={`code-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-12 text-2xl text-center rounded-lg border-2 border-primary bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={code[idx]}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputRefs.current[idx] = el)}
              autoFocus={idx === 0}
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold transition mb-2"
        >
          Valider
        </button>
        {message && <p className="mt-2 text-center text-destructive">{message}</p>}
      </form>
    </div>
  );
};

export default Validation;
