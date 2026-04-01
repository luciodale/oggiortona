import { $signInStore, $signUpStore, $isLoadedStore, $clerkStore } from "@clerk/astro/client";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import { getRedirectUrl } from "../utils/url";

type Step = "email" | "verify";

export function useEmailCodeSignIn() {
  const signIn = useStore($signInStore);
  const signUp = useStore($signUpStore);
  const clerk = useStore($clerkStore);
  const isLoaded = useStore($isLoadedStore);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({ identifier: email });
      const emailCodeFactor = result.supportedFirstFactors?.find(
        (f) => f.strategy === "email_code"
      );

      if (!emailCodeFactor || !("emailAddressId" in emailCodeFactor)) {
        setError("Codice email non supportato per questo account.");
        return;
      }

      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailCodeFactor.emailAddressId,
      });
      setStep("verify");
    } catch (err) {
      // If user doesn't exist, create via sign-up flow
      const clerkError = err as { errors?: Array<{ code: string }> };
      if (clerkError.errors?.some((e) => e.code === "form_identifier_not_found")) {
        try {
          await handleSignUpWithCode();
        } catch (signUpErr) {
          setError(signUpErr instanceof Error ? signUpErr.message : "Errore durante la registrazione.");
        }
      } else {
        setError(err instanceof Error ? err.message : "Errore di accesso.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUpWithCode() {
    if (!signUp) return;

    const result = await signUp.create({ emailAddress: email });
    await result.prepareEmailAddressVerification({ strategy: "email_code" });
    setStep("verify");
  }

  async function handleVerifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded || !clerk) return;

    setLoading(true);
    setError("");

    try {
      // Try sign-in verification first
      if (signIn?.firstFactorVerification?.status !== "verified") {
        const result = await signIn!.attemptFirstFactor({
          strategy: "email_code",
          code,
        });

        if (result.status === "complete") {
          await clerk.setActive({ session: result.createdSessionId });
          window.location.href = getRedirectUrl();
          return;
        }
      }
    } catch {
      // If sign-in verify fails, try sign-up verify
      try {
        if (signUp) {
          const result = await signUp.attemptEmailAddressVerification({ code });
          if (result.status === "complete") {
            await clerk.setActive({ session: result.createdSessionId });
            window.location.href = getRedirectUrl();
            return;
          }
        }
      } catch (verifyErr) {
        setError(verifyErr instanceof Error ? verifyErr.message : "Codice non valido.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
  }

  function handleBack() {
    setStep("email");
    setCode("");
    setError("");
  }

  return {
    email,
    setEmail,
    code,
    setCode,
    step,
    error,
    loading,
    handleSendCode,
    handleVerifyCode,
    handleBack,
  };
}
