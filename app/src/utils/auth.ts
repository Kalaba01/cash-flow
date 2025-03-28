import { jwtDecode, JwtPayload } from "jwt-decode";

export function isUserAuthenticated(): boolean {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp !== undefined && decoded.exp > currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}
