export type PublicationType = "POST" | "HISTORIA" | "REEL";

export interface ScheduleInput {
  startDate: Date;
  durationDays: number;
  postsCount: number;
  historiasCount: number;
  reelsCount: number;
}

export interface ScheduledPublication {
  date: Date;
  type: PublicationType;
}

export function generateSchedule(input: ScheduleInput): ScheduledPublication[] {
  const { startDate, durationDays, postsCount, historiasCount, reelsCount } =
    input;

  const totalPublications = postsCount + historiasCount + reelsCount;
  if (totalPublications === 0 || durationDays <= 0) {
    return [];
  }

  // Create array of all publications with their types
  const publicationTypes: PublicationType[] = [
    ...Array(postsCount).fill("POST"),
    ...Array(historiasCount).fill("HISTORIA"),
    ...Array(reelsCount).fill("REEL"),
  ];

  // Shuffle to mix types evenly
  for (let i = publicationTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [publicationTypes[i], publicationTypes[j]] = [
      publicationTypes[j],
      publicationTypes[i],
    ];
  }

  // Calculate interval to spread publications across duration
  const interval = durationDays / totalPublications;
  const publications: ScheduledPublication[] = [];

  if (totalPublications <= durationDays) {
    const usedDates = new Set<string>();

    for (let i = 0; i < totalPublications; i++) {
      let offsetDays = Math.floor(i * interval);

      // Find next available day if this one is taken
      let attempts = 0;
      while (attempts < durationDays) {
        const testDate = new Date(startDate);
        testDate.setDate(testDate.getDate() + offsetDays);
        const dateKey = testDate.toISOString().split("T")[0];

        if (!usedDates.has(dateKey) && offsetDays < durationDays) {
          usedDates.add(dateKey);
          publications.push({
            date: testDate,
            type: publicationTypes[i],
          });
          break;
        }

        offsetDays++;
        attempts++;
      }
    }
  } else {
    for (let i = 0; i < totalPublications; i++) {
      const offsetDays = Math.min(durationDays - 1, Math.floor(i * interval));
      const testDate = new Date(startDate);
      testDate.setDate(testDate.getDate() + offsetDays);
      publications.push({
        date: testDate,
        type: publicationTypes[i],
      });
    }
  }

  return publications.sort((a, b) => a.date.getTime() - b.date.getTime());
}
