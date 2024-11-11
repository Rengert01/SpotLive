import { Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import tracks from '@/data/made-for-you.json';
import { Link } from 'react-router-dom'; // Assuming you are using react-router for navigation

export default function MadeForYou() {
    return (
        <section className="">
            <h2 className="text-3xl font-bold mb-6 text-black">Made For You</h2>
            <div className="relative">
                <div className="flex space-x-4 overflow-x-auto" style={{ width: '100%' }}>
                    {tracks.map((track) => (
                        <div key={track.id} className="group relative flex-shrink-0 w-48">
                            <div className="aspect-square overflow-hidden rounded-lg bg-gray-800">
                                <img
                                    src={`/assets/tracks/made-for-you-tracks/covers/${track.cover}`}
                                    alt={`${track.title} by ${track.artist}`}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                />
                                <div
                                    className="absolute inset-0 flex items-center justify-center border-0 group-hover:border-4 group-hover:border-black transition-all duration-300">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1/2 group-hover:translate-y-0"
                                    >
                                        <Play className="w-4 h-4"/>
                                        <span className="sr-only">Play {track.title}</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-2 relative">
                                <h3 className="text-lg font-semibold text-black">{track.title}</h3>
                                <p className="text-sm text-gray-400">
                                    <Link to={`/user/${track.artist.replace(/\s+/g, '-').toLowerCase()}`} className="text-blue-500 hover:underline z-10 relative">
                                        {track.artist}
                                    </Link>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}