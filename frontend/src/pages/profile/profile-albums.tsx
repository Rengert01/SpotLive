import TrackSection from '@/components/ui/track-section';
import { useEffect, useState } from 'react';
import axios from '@/config/axios';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export default function ProfileSongs() {
  const [releasedAlbums, setReleasedAlbums] = useState<AlbumType[]>([]);
  const [unreleasedAlbums, setUnreleasedAlbums] = useState<AlbumType[]>([]);

  // Fetch recently released albums
  const fetchReleasedAlbums = async () => {
    axios
      .get('/api/music/list?private=false&personal=true')
      .then((res) => {
        setReleasedAlbums(
          res.data.musicList.map((album: AlbumType) => ({
            id: album.id,
            title: album.title,
            artist: album.artist,
            cover: album.cover,
          }))
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchUnreleasedAlbums = async () => {
    axios
      .get('/api/music/list?private=true&personal=true')
      .then((res) => {
        setUnreleasedAlbums(
          res.data.musicList.map((album: AlbumType) => ({
            id: album.id,
            title: album.title,
            artist: album.artist,
            cover: album.cover,
          }))
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    Promise.all([fetchReleasedAlbums(), fetchUnreleasedAlbums()]);
  }, []);

  return (
    <>
      <div className="flex justify-end mb-4">
          <Link to="../albums/upload">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Upload Album
            </Button>
          </Link>
      </div>
      <TrackSection
        title="Your Released Songs"
        subtitle="Albums that you have released"
        tracks={releasedAlbums}
      />
      <TrackSection
        title="Your Private Songs"
        subtitle="Albums that you have set to private"
        tracks={unreleasedAlbums}
      />
    </>
  );
}
