import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ReactNode } from 'react';

interface AlbumSectionProps {
  title: string;
  subtitle: string;
  albums: AlbumType[];
  children?: ReactNode;
}

export default function AlbumSection({
  title,
  subtitle,
  albums,
  children,
}: AlbumSectionProps) {
  const handleAlbumClick = (album: AlbumType) => {
    console.log('Album clicked:', album);
  };

  return (
    <div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold text-black">{title}</h2>
          {children}
        </div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="w-full">
        <div className="flex w-max space-x-4 mb-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="cursor-pointer group"
              onClick={() => handleAlbumClick(album)}
            >
              <div className="relative">
                <img
                  src={
                    import.meta.env.VITE_APP_API_URL +
                      '/uploads/image/' +
                      album.cover || '/default-cover.jpg'
                  }
                  alt={album.title}
                  className="w-48 h-48 object-cover rounded-lg transition-transform transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity rounded-lg" />
              </div>
              <div className="mt-2 text-center">
                <h3 className="text-lg font-semibold">{album.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {album.artist.username}
                </p>
              </div>
            </div>
          ))}
          <ScrollBar orientation="horizontal" />
        </div>
      </ScrollArea>
    </div>
  );
}
