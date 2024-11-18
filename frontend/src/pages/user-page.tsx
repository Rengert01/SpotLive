import tracks from '@/data/tracks.json';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TrackSection from '@/components/ui/track-section';

const UserProfile = () => {
  const { id } = useParams();
  const curr = tracks.find((track) => track.id === id);

  if (!curr) {
    return <div>Track not found</div>;
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-black-900 to-white text-black">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        <img
          src={`/assets/tracks/${curr.cover}`}
          alt={curr.artist}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-5xl font-bold mb-2">{curr.artist}</h1>
          <p className="text-black-300">1,234,567 monthly listeners</p>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            className="text-Black border-white hover:bg-white/10"
          >
            Follow
          </Button>
        </div>

        {/* <div className="max-w-3xl"> */}
        {/* <h2 className="text-black-2xl font-bold mb-4">About</h2> */}
        {/* <p className="text-black-300 leading-relaxed">{curr.bio}</p> */}
        {/* </div> */}

        {/* TODO */}
        {/* <TrackSection
          title={`From ${curr.artist}`}
          filterFunction={(track) => track.artist === curr.artist}
        /> */}
      </div>
    </section>
  );
};

export default UserProfile;
