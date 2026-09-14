import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { signInWithGoogle } from "../services/authService";
import { isFirebaseConfigured } from "../services/firebase";

export function LoginPage() {
  const { user } = useAuth();
  const notify = useToast();
  const [saving, setSaving] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleLogin() {
    setSaving(true);
    try {
      await signInWithGoogle();
      notify("Signed in successfully.", "success");
    } catch (error) {
      console.error(error);
      notify("Google sign-in failed. Check Firebase setup and authorized domains.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4">
      <section className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-soft">
        <div className="mb-9">
          <p className="font-display text-5xl leading-none text-ink">Dare & Rise</p>
          <p className="mt-2 text-sm font-bold uppercase tracking-wide text-ink/50">Social Planner</p>
        </div>
        {!isFirebaseConfigured && (
          <div className="mb-4 rounded-lg border border-rosewood/20 bg-rosewood/5 p-3 text-sm font-semibold text-rosewood">
            Add Firebase values to `.env.local` before signing in.
          </div>
        )}
        <Button className="w-full" onClick={handleLogin} isLoading={saving} icon={<ArrowRight size={18} />}>
          Continue with Google
        </Button>
      </section>
    </main>
  );
}
