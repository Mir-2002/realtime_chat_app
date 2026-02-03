"use client";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useUsername } from "./api/hooks/use-username";
import { Suspense, useState } from "react";

const Page = () => {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  );
};

function Lobby() {
  const { username } = useUsername();

  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");

  const [createError, setCreateError] = useState<string | null>(null);

  const router = useRouter();
  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async () => {
      setCreateError(null);

      const res = await client.room.create.post();

      if (res.status !== 200) {
        throw new Error(
          (res as any)?.error?.value?.message ?? "Failed to create room"
        );
      }

      const roomId = res.data?.roomId;
      if (!roomId) throw new Error("No roomId returned from server");

      router.push(`/room/${roomId}`);
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to create room";
      setCreateError(message);
      // Keep a dev-friendly breadcrumb too.
      console.error(err);
    },
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {wasDestroyed && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM DESTROYED</p>
            <p className="text-zinc-500 text-xs mt-1">
              All messages have been permanently deleted.
            </p>
          </div>
        )}
        {error === "room-not-found" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM NOT FOUND</p>
            <p className="text-zinc-500 text-xs mt-1">
              This room may have expired or doesn't exist.
            </p>
          </div>
        )}
        {error === "room-full" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM FULL </p>
            <p className="text-zinc-500 text-xs mt-1">
              Room is at full capacity.
            </p>
          </div>
        )}
        {createError && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">
              COULDN'T CREATE ROOM
            </p>
            <p className="text-zinc-500 text-xs mt-1 wrap-break-word">
              {createError}
            </p>
          </div>
        )}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">
            {">"}private_chat
          </h1>
          <p className="text-zinc-500 text-sm">
            A private, self-destructing, chat room.
          </p>
        </div>
        <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-zinc-500">
                Your Identity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
                  {username}
                </div>
              </div>
            </div>
            <button
              onClick={() => createRoom()}
              disabled={isPending}
              className="w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? "CREATING..." : "CREATE SECURE ROOM"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
