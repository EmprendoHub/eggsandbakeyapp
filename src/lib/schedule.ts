export type PublicationType = "POST" | "HISTORIA" | "REEL" | "PAUTA";

export interface ScheduleInput {
  startDate: Date;
  durationDays: number;
  postsCount: number;
  historiasCount: number;
  reelsCount: number;
  pautasCount: number;
}

export interface ScheduledPublication {
  date: Date;
  type: PublicationType;
}

/**
 * Places `count` items of `type` evenly across the null (available) slots of `slots`.
 *
 * Uses the formula: pick = floor((i + 0.5) * available.length / count)
 * This guarantees strictly increasing, collision-free positions as long as count ≤ available.length.
 * Each type is centered within its equal segment of the slot space.
 */
function placeTypeEvenly(
  slots: (PublicationType | null)[],
  type: PublicationType,
  count: number,
): void {
  if (count <= 0) return;

  // Collect indices of still-empty slots
  const available: number[] = [];
  for (let i = 0; i < slots.length; i++) {
    if (slots[i] === null) available.push(i);
  }

  if (available.length === 0 || count > available.length) return;

  for (let i = 0; i < count; i++) {
    // Center of each equal segment → guaranteed unique, increasing index
    const pick = Math.floor(((i + 0.5) * available.length) / count);
    slots[available[pick]] = type;
  }
}

export function generateSchedule(input: ScheduleInput): ScheduledPublication[] {
  const {
    startDate,
    durationDays,
    postsCount,
    historiasCount,
    reelsCount,
    pautasCount,
  } = input;

  const totalPublications =
    postsCount + historiasCount + reelsCount + pautasCount;
  if (totalPublications === 0 || durationDays <= 0) {
    return [];
  }

  // ── Step 1: Build a type sequence with all types evenly distributed ──────────
  //
  // Priority order: PAUTA first so it anchors the grid; then REEL, HISTORIA, POST.
  // Each call only sees the slots left empty by previous calls, so every type
  // ends up spread across the full plan without any type clustering together.
  //
  // Example — 20 pubs (4 PAUTA · 4 REEL · 4 HISTORIA · 8 POST):
  //   PAUTA  at slots 2, 7, 12, 17  (every ~5)
  //   REEL   at slots 3, 8, 13, 18  (fills gaps between pautas)
  //   HISTORIA at slots 1, 5, 10, 15
  //   POST   fills the rest: 0, 4, 6, 9, 11, 14, 16, 19
  //
  const slots: (PublicationType | null)[] = new Array(totalPublications).fill(
    null,
  );

  placeTypeEvenly(slots, "PAUTA", pautasCount);
  placeTypeEvenly(slots, "REEL", reelsCount);
  placeTypeEvenly(slots, "HISTORIA", historiasCount);
  placeTypeEvenly(slots, "POST", postsCount);

  const typeSequence = slots as PublicationType[];

  // ── Step 2: Assign dates evenly across the duration ──────────────────────────
  const publications: ScheduledPublication[] = [];

  if (totalPublications <= durationDays) {
    // At most one publication per day — spread them out
    const interval = durationDays / totalPublications;
    const usedDates = new Set<string>();

    for (let i = 0; i < totalPublications; i++) {
      let offsetDays = Math.round(i * interval);
      if (offsetDays >= durationDays) offsetDays = durationDays - 1;

      // Advance to the next free day if needed
      let attempts = 0;
      while (attempts < durationDays) {
        if (offsetDays >= durationDays) break;

        const testDate = new Date(startDate);
        testDate.setUTCDate(testDate.getUTCDate() + offsetDays);
        testDate.setUTCHours(12, 0, 0, 0); // normalize to UTC noon
        const dateKey = testDate.toISOString().split("T")[0];

        if (!usedDates.has(dateKey)) {
          usedDates.add(dateKey);
          publications.push({ date: testDate, type: typeSequence[i] });
          break;
        }

        offsetDays++;
        attempts++;
      }
    }
  } else {
    // More publications than days — allow multiple per day
    const interval = durationDays / totalPublications;
    for (let i = 0; i < totalPublications; i++) {
      const offsetDays = Math.min(durationDays - 1, Math.floor(i * interval));
      const testDate = new Date(startDate);
      testDate.setUTCDate(testDate.getUTCDate() + offsetDays);
      testDate.setUTCHours(12, 0, 0, 0); // normalize to UTC noon
      publications.push({ date: testDate, type: typeSequence[i] });
    }
  }

  return publications.sort((a, b) => a.date.getTime() - b.date.getTime());
}
