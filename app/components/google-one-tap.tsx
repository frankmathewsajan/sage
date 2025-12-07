"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

// Minimal types for google one-tap
interface CredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            nonce: string;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

// generate nonce to use for google id token sign-in
const generateNonce = async (): Promise<[string, string]> => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return [nonce, hashedNonce];
};

export default function GoogleOneTap() {
  const supabase: SupabaseClient = createClient();
  const router = useRouter();

  const initializeGoogleOneTap = async () => {
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!GOOGLE_CLIENT_ID) {
      console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID; skipping One Tap init.");
      return;
    }

    if (!window.google?.accounts?.id) return;

    const [nonce, hashedNonce] = await generateNonce();

    const { data, error } = await supabase.auth.getSession();
    if (!error && data.session) {
      router.push("/");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: CredentialResponse) => {
        try {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
            nonce,
          });
          if (error) throw error;
          document.cookie = `sage-auth=${data.session?.access_token ?? ""}; Path=/; Max-Age=604800; SameSite=Lax`;
          router.push("/dashboard");
        } catch (err) {
          console.error("Error logging in with Google One Tap", err);
        }
      },
      nonce: hashedNonce,
      use_fedcm_for_prompt: true,
    });
    window.google.accounts.id.prompt();
  };

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onReady={() => {
        void initializeGoogleOneTap();
      }}
    />
  );
}
