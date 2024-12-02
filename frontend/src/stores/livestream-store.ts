import { LivestreamStateEnum } from '@/@types/livestream-state';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Livestream {
  id: string | undefined;
  title: string | undefined;
  isStreaming: boolean;
  state: LivestreamStateEnum;
}

interface LivestreamState {
  livestream: Livestream;
  setLivestream: (livestream: Livestream) => void;
}

export const useLivestreamStore = create<LivestreamState>()(
  persist(
    (set) => ({
      livestream: {
        id: undefined,
        title: undefined,
        isStreaming: false,
        state: LivestreamStateEnum.IDLE,
      },
      setLivestream: (livestream) => set({ livestream }),
    }),
    {
      name: 'livestream-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
