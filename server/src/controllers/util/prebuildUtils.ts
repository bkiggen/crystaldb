function expandCycleString(cycle: string | null | undefined): Set<number> {
  if (!cycle) return new Set();

  const result = new Set<number>();

  cycle.split(",").forEach((part) => {
    const trimmed = part.trim();
    const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);

    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      for (let i = start; i <= end; i++) result.add(i);
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) result.add(num);
    }
  });

  return result;
}

export function findConflictingPrebuilds(
  preBuilds: {
    id: number;
    cycle: string | null;
    subscription: { id: number };
  }[],
  selectedIds: number[]
): { id: number; conflictingIds: number[] }[] {
  const idToCycles = new Map<number, Set<number>>();
  const idToSubscriptionId = new Map<number, number>();

  preBuilds.forEach((pb) => {
    idToCycles.set(pb.id, expandCycleString(pb.cycle));
    idToSubscriptionId.set(pb.id, pb.subscription.id);
  });

  const result: { id: number; conflictingIds: number[] }[] = [];

  selectedIds.forEach((id) => {
    const targetCycles = idToCycles.get(id);
    const targetSubId = idToSubscriptionId.get(id);
    if (!targetCycles || targetSubId === undefined) return;

    const conflicts: number[] = [];

    preBuilds.forEach((other) => {
      if (other.id === id) return;

      const otherCycles = idToCycles.get(other.id);
      const otherSubId = idToSubscriptionId.get(other.id);
      if (!otherCycles || otherSubId === undefined) return;

      // Only check for conflicts if the subscription.id is the same
      if (targetSubId === otherSubId) {
        const hasOverlap = [...targetCycles].some((num) =>
          otherCycles.has(num)
        );
        if (hasOverlap) {
          conflicts.push(other.id);
        }
      }
    });

    if (conflicts.length > 0) {
      result.push({ id, conflictingIds: conflicts });
    }
  });

  return result;
}
