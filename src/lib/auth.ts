const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CALLBACK_URL = import.meta.env.VITE_GOOGLE_CALLBACK_URL;
export function getCodeFromUrl(url: string): string | null {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  const code = params.get("code");
  return code;
}
export function createGoogleLoginUrl() {
  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const scope = "email profile"; // 请求 email 和 profile 信息
  const responseType = "code"; // 我们希望得到一个授权码

  const url = new URL(baseUrl);

  url.searchParams.append("client_id", GOOGLE_CLIENT_ID);
  url.searchParams.append("redirect_uri", GOOGLE_CALLBACK_URL);
  url.searchParams.append("scope", scope);
  url.searchParams.append("response_type", responseType);

  // return url.toString();
  console.log(url.toString());
  
  // window.location.href = url.toString();
}
