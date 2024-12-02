import tracks from '@/data/tracks.json';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import axios from '@/config/axios';
import { useMusicStore } from '@/stores/music-info-store';

const UserProfile = () => {
  const { id } = useParams();
  const curr = tracks.find((track) => track.id === id);
  const { music, setMusic, clearMusic } = useMusicStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log('music', music);
  useEffect(() => {
    //Todo: Convert this to a custom auth hook
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/music/info/${id}`);
        setMusic(res.data.music);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [id, setMusic, clearMusic]);
  const handleFollowToggle = async () => {
    if (!music) return;

    const url = music.isFollowing
      ? `/api/unfollow/${music?.id}`
      : `/api/follow/${music?.id}`;

    try {
      const res = await axios.post(url);
      if (res.status === 200) {
        // Update the isFollowing status in the store
        setMusic({ ...music, isFollowing: !music.isFollowing });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (!music) return <div>Music not found</div>;
  return (
    <section className="min-h-screen bg-gradient-to-b from-black-900 to-white text-black">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        <img
          src={`${import.meta.env.VITE_APP_API_URL}/api/uploads/image/${music.cover}`}
          alt={music.artist.username || 'Artist'}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-5xl font-bold mb-2">
            {music.title || 'Unknown Artist'}
          </h1>
          <p className="text-black-300">1,234,567 monthly listeners</p>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            className={`text-black border-white hover:bg-black hover:text-white`}
            onClick={handleFollowToggle}
          >
            {music.isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
