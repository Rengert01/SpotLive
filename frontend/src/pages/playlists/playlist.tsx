import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import axios from '@/config/axios';
  import { useParams } from 'react-router-dom';
  import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { usePlaylistsStore } from '@/stores/playlist-store';
  export default function PlaylistPage() {
    const { id } = useParams<{ id: string }>();

    const [musics, setMusics] = useState<TrackType[]>([]);
    const { playlists, setPlaylists } = usePlaylistsStore();
    const playlist = playlists.find((playlist) => playlist.id === Number(id));

    useEffect(() => {
        const fetchMusics = async (id: string) => {
          axios
            .get(`/api/playlist/${id}/musics`)
            .then((res) => {
              console.log("data", res.data.musics);
              setMusics(res.data.musics);
            })
            .catch((err) => {
              console.error(err);
            });
        };
        if (id) {
          fetchMusics(id);
        }
    }, [id]);
    return (
        <Card>
          <CardHeader>
            <CardTitle>Album Tracks</CardTitle>
            <CardDescription>
              Add the songs you want to insert into your album.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {musics.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {musics.map((track) => (
                    <li
                      key={track.id}
                      className="flex items-center py-2 gap-4"
                    >
                      <img
                        src={
                          import.meta.env.VITE_APP_API_URL +
                          '/api/uploads/image/' +
                          track.music.cover
                        }
                        alt={`${track.music.title} cover`}
                        className="h-10 rounded"
                      />
                      <div className="grow flex items-center justify-between">
                        <div className="flex">
                          <p className="font-medium">{track.music.title}</p>
                          <Button
                            variant="ghost"
                            className="ml-auto"
                            onClick={() => {
                                axios
                                .delete(`/api/playlist/${playlist.id}/musics/${track.music.id}`)
                                .then(() => {
                                    toast({
                                    title: 'Music deleted from playlist',
                                    });
                                })
                                .catch((error) => {
                                    toast({
                                    title: 'Operation Failed',
                                    description: error.response.data.message,
                                    });
                                });
                            }}
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No tracks available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      );
      
      
  }