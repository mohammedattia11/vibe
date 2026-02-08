import { useTRPC } from "@/trpc/client";
import type { UserResource } from "@clerk/types";

export type TreeItemType = string | [string, ...TreeItemType[]];

export type TrpcUtils = ReturnType<typeof useTRPC>

export type ClerkUserType = UserResource | null | undefined;