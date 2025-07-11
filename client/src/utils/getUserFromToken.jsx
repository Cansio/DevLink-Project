// utils/getUserFromToken.js
import {jwtDecode} from "jwt-decode";

export function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id; // This assumes you sign tokens as { id: user._id }
  } catch (err) {
    return null;
  }
}
