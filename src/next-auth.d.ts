import type { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user : User & DefaultSession['user'];
    }
    interface Token {
        user : User & DefaultSession['user'];
    }
    interface User {
        role : string | null;
        id : string | null;
    }
}