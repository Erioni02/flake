const ENDPOINT = "https://api.web3forms.com/submit";

/**
 * Web3Forms access keys are designed to be used from the browser — they only
 * allow sending a form to the inbox the key was registered with. It still lives in
 * an environment variable so it never sits in source control.
 */
export const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

export class SubmitError extends Error {}

export async function submitToWeb3Forms(fields: Record<string, string>, signal?: AbortSignal) {
  if (!WEB3FORMS_KEY) {
    throw new SubmitError("Ordering is temporarily unavailable. Please try again later.");
  }

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...fields }),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new SubmitError("We couldn't reach the server. Check your connection and try again.");
  }

  const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
  if (!res.ok || !data?.success) {
    throw new SubmitError(data?.message || "Your order couldn't be sent. Please try again.");
  }
  return data;
}
