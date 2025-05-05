function getFirstNumber(cycle: string | null | undefined): number {
  if (!cycle) return Number.MAX_SAFE_INTEGER; // null/undefined cycles go last
  const match = cycle.match(/\d+/); // extract first number
  return match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
}

export const sortStringRanges = (items: any[]) => {
  return items.sort((a, b) => {
    const subA = a.subscription.id;
    const subB = b.subscription.id;
    if (subA !== subB) return subA - subB;

    const cycleA = getFirstNumber(a.cycle);
    const cycleB = getFirstNumber(b.cycle);
    return cycleA - cycleB;
  });
};
