"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "./Context";
import type { ActionResult } from "../_types/ActionType";
import Link from "next/link";

type Props = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  successMessage?: string;     
  submitLabel?: string;
  useIdempotencyKey?: boolean;  
  className?: string;
  savingString? : string,
  submitButtonColorString :  string,
  needCancelButton? : boolean, 
  cancelString? : string,
  cancelRedirection? : string,
  children: React.ReactNode;
};

export default function ActionForm({action,
  successMessage = "Saved",
  submitLabel = "Save",
  useIdempotencyKey = false,
  className,
  savingString,
  submitButtonColorString,
  needCancelButton,
  cancelString,
  cancelRedirection,
  children,
}: Props) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null
  );
  const { showNotification } = useNotification();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  useEffect(() => {
    if (!state) return;
    if (!state.ok) {
      showNotification(state.error, "error");
      return;
    }

    showNotification(state.message ?? successMessage, "success");
    if (state.redirectTo) {
      router.push(state.redirectTo);
    } else {
      formRef.current?.reset();
      setIdempotencyKey(crypto.randomUUID());
      router.refresh();
    }
  }, [state, showNotification, router, successMessage]);

  return (
    <form ref={formRef} action={formAction} className={className}>
      {useIdempotencyKey && (
        <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      )}
      {children}
      <button type="submit" disabled={isPending} className={`disabled:opacity-50 text-black pl-2 pr-2 p-1 w-fit rounded-sm ${submitButtonColorString} bg-cyan-200`}>
        {isPending ? savingString : submitLabel}
      </button>
      {
        needCancelButton ?
          <Link href={cancelRedirection ? cancelRedirection : "/"}  className="pl-2 pr-2 p-1 w-fit rounded-sm text-black bg-gray-200">{cancelString}</Link>
          :
          <></>
      }
    </form>
  );
}