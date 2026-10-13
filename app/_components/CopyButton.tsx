"use client";

import { useNotification } from "@/app/_components/Context";

export default function CopyButton({ text }: { text: string }) {
  const { showNotification } = useNotification();
  return (
    <button
      type="button"
      className="rounded-sm bg-gray-300 px-3 py-1 text-black"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          showNotification("Link copied", "success");
        } catch {
          showNotification("Couldn't copy. Select the link and copy it manually.", "error");
        }
      }}
    >
      Copy
    </button>
  );
}