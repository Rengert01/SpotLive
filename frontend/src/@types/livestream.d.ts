type Livestream = {
  title: string;
  id: number;
  artist: {
    email: string;
    image: string;
    username: string | null;
  };
};
