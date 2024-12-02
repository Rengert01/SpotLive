import { create } from 'zustand';

interface ArtistInfo {
  email: string;
  username: string;
  image: string;
}

interface MusicInfo {
  id: number;
  title: string;
  cover: string;
  path: string;
  public: boolean;
  duration: string;
  artistId: number;
  createdAt: string;
  artist: ArtistInfo;
  isFollowing: boolean;
}

interface MusicState {
  music: MusicInfo | null;
  setMusic: (music: MusicInfo) => void;
  clearMusic: () => void;
}

export const useMusicStore = create<MusicState>((set) => ({
  music: null,
  setMusic: (music) => set({ music }),
  clearMusic: () => set({ music: null }),
}));
