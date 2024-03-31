import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { createPersister } from "./persister";

type ThemeType = "light" | "dark" | "system";

type AppSettingsState = {
  value: number;
  theme: ThemeType;
};

const defaultState: AppSettingsState = {
  value: 3,
  theme: "system",
};

type AppSettingsSlice = AppSettingsState & {
  setTheme: (theme: ThemeType) => void;
};

export const settingsStoreCreator: StateCreator<AppSettingsSlice> = (set) => ({
  ...defaultState,
  setTheme: (theme) => set({ theme }),
});

export const useSettingsStore = create<AppSettingsSlice>()(
  persist(
    settingsStoreCreator,
    createPersister({ version: 1, name: "settings" })
  )
);
