type MemoryKind = "conversation" | "task" | "knowledge" | "profile";

export type MemoryRecord = {
  id: string;
  userId: number;
  kind: MemoryKind;
  content: string;
  createdAt: string;
};

const memoryStore: MemoryRecord[] = [];

export async function writeMemory(record: Omit<MemoryRecord, "id" | "createdAt">) {
  const next: MemoryRecord = {
    ...record,
    id: `mem-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  memoryStore.unshift(next);
  return next;
}

export async function readMemory(userId: number, kind?: MemoryKind, limit = 20) {
  return memoryStore
    .filter(m => m.userId === userId && (!kind || m.kind === kind))
    .slice(0, limit);
}

