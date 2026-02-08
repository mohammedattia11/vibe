import { ClerkUserType } from "@/types";
import { toast } from "sonner";
export const handleGithubAuth = async (clerkUser: ClerkUserType) => {
    try {
      if (!clerkUser) return;

      const account = await clerkUser.createExternalAccount({
        strategy: "oauth_github",
        redirectUrl: window.location.href,
        additionalScopes: ["repo", "user"],
      });

      const redirectURL = account.verification?.externalVerificationRedirectURL;

      if (redirectURL) {
        const urlWithPrompt = new URL(redirectURL.href);
        urlWithPrompt.searchParams.set("prompt", "select_account");

        window.location.href = urlWithPrompt.href;
      }
    } catch (err: any) {
      toast.error("Failed to initiate GitHub authentication");
      console.error(err);
    }
  };