import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000", // A porta que está no seu package.json (vite dev)
});

export const { signIn, signUp, useSession, signOut } = authClient;