import { fetchUsersId } from "@/services/userService";
import UsuarioClientPage from "./client";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface JWTPayload {
  id: string;
}

export default async function IndexUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let userId: string | undefined = undefined;

  if (typeof token === "string") {
    const decoded = jwtDecode<JWTPayload>(token);
    userId = decoded.id;
  }

  const users = await fetchUsersId(userId);
  const user = users[0]
  console.log(user)

  return <UsuarioClientPage user={user} />;
}
