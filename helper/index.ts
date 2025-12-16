export const determineProductQuality = (quality: number) => {
  switch (quality) {
    case 0:
      return { name: "very low", color: "red" };
    case 1:
      return { name: "low", color: "green" };
    case 2:
      return { name: "moderate", color: "blue" };
    case 3:
      return { name: "high", color: "purple" };
    case 4:
      return { name: "heavenly", color: "yellow" };
  }
};

export const calculateBudgetByRank = (
  budget: number,
  level: number,
  maxBudget: number
): number => {
  if (level <= 1) return budget;

  if (level < 51) {
    const groupIndex = Math.floor((level - 1) / 5);
    const offsetInGroup = (level - 1) % 5;

    const groupMultiplier = 1 + groupIndex * 0.25;
    const incremental = offsetInGroup === 0 ? 0 : (offsetInGroup / 4) * 0.25;

    const multiplier = groupMultiplier + incremental;

    return Math.floor(budget * multiplier);
  }

  const kingpinRank = level - 50;
  const multiplier = 34 + kingpinRank;

  return Math.round((maxBudget / 100) * multiplier);
};

export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
