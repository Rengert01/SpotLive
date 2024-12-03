import { create } from 'zustand';

interface UserState {
  user: PersonalInformationProps;
  setUser: (user: PersonalInformationProps) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {},
  setUser: (user) => set({ user }),
  clearUser: () => set({}),
}));
