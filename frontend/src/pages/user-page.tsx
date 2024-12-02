import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from '@/config/axios';
import { useMusicStore } from '@/stores/music-info-store';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/stores/user-store';

const UserProfile = () => {
  const { id } = useParams();
  const { music, setMusic, clearMusic } = useMusicStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchSession = async (isload: boolean) => {
    if (isload) setIsLoading(true);
    try {
      const res = await axios.get(`/api/music/info/${id}`);
      setMusic(res.data.music);
    } catch (err) {
      console.error('Error fetching music info:', err);
    } finally {
      if (isload) setIsLoading(false); // Ensure setLoading is called after try-catch
    }
  };
  useEffect(() => {
    fetchSession(true);
  }, [id, setMusic, clearMusic]);
  const handleFollowToggle = async () => {
    if (!music) return;

    const url = music.isFollowing ? `/api/user/unfollow/` : `/api/user/follow/`;

    setLoading(true);
    try {
      const res = await axios.post(url, {
        followerId: user.id,
        followedId: music.artistId,
      });
      if (res.status === 200) {
        // Update the isFollowing status in the store

        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Oooops...Something went wrongs',
      });
      setLoading(false);
    }
    fetchSession(false);
    setLoading(false);
  };

  if (isLoading)
    return (
      <section className="min-h-screen bg-gradient-to-b from-black-900 to-white text-black">
        <div className="relative">
          <Skeleton className="w-full h-[100px] object-cover" />

          <div className="absolute bottom-0 left-0 p-8">
            <Skeleton className="h-12 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>
    );

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
        {Number(user.id) !== music.artistId && (
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              className={`text-black border-white hover:bg-black hover:text-white`}
              onClick={handleFollowToggle}
              disabled={loading}
            >
              {!loading ? (
                <span>{music.isFollowing ? 'Unfollow' : 'Follow'}</span>
              ) : (
                <span>Loading ..</span>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserProfile;
