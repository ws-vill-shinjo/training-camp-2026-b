export type UnlockTarget = { type: "production"; id: string } | { type: "bonus"; id: string };

export type UnlockResult =
  | { success: true; contentId: string; alreadyUnlocked: boolean }
  | { success: false; reason: string };
