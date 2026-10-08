export function encodeHistoryCursor(cursor: {
  createdAt: Date;
  id: number;
}) {
  return Buffer.from(
    JSON.stringify({
      createdAt: cursor.createdAt.toISOString(),
      id: cursor.id,
    })
  ).toString("base64url");
}

export function decodeHistoryCursor(value: string) {
  const parsed = JSON.parse(
    Buffer.from(value, "base64url").toString()
  );

  return {
    createdAt: new Date(parsed.createdAt),
    id: Number(parsed.id),
  };
}