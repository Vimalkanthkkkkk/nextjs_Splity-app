import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/app/_orm/db";
import { recoveryTokens , eventMembers } from "@/app/_orm/schema";
import ActionForm from "@/app/_components/ActionForm";
import { hashToken } from "@/app/_components/utils";
import { completeRecoveryAction } from "@/app/_components/utils";

export default async function RecoverPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const [row] = await db
    .select({ name: eventMembers.name })
    .from(recoveryTokens)
    .innerJoin(eventMembers, eq(recoveryTokens.memberId, eventMembers.id))
    .where(
      and(
        eq(recoveryTokens.tokenHash, hashToken(token)),
        isNull(recoveryTokens.usedAt),
        gt(recoveryTokens.expiresAt, new Date())
      )
    );

  if (!row) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-black">
        <h1 className="text-lg font-semibold mb-2">This link has expired</h1>
        <p className="text-sm text-gray-600">
          Open your invite link again and request a new sign-in email.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 text-black">
      <div className="bg-white rounded-sm shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] p-4 flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Welcome back, {row.name}</h1>
        <p className="text-sm text-gray-600">
          Continuing signs you in on this device and signs out any other device using this name.
        </p>
        <ActionForm
          action={completeRecoveryAction}
          submitLabel={`Continue as ${row.name}`}
          savingString="Signing in..."
          submitButtonColorString="w-full rounded-md bg-cyan-200 py-2 text-black disabled:opacity-50"
        >
          <input type="hidden" name="token" value={token} />
        </ActionForm>
      </div>
    </div>
  );
}