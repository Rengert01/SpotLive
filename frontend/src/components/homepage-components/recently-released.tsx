import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'
import { Button } from "@/components/ui/button"
import tracks from '@/data/recently-released.json'

export default function RecentlyReleased() {
    const [images, setImages] = useState<{ [key: string]: string }>({})
    const [error, setError] = useState<string | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const tracksPerPage = 4

    useEffect(() => {
        const loadImages = async () => {
            try {
                const importedImages = await Promise.all(
                    tracks.map(async (track) => {
                        const imagePath = `../../assets/tracks/recently-released-tracks/covers/${track.cover}`
                        const image = await import(imagePath)
                        return { [track.id]: image.default }
                    })
                )
                setImages(Object.assign({}, ...importedImages))
            } catch (err) {
                setError('Failed to load images')
                console.error(err)
            }
        }
        loadImages()
    }, [])

    const nextTracks = () => {
        setCurrentIndex((prevIndex) => (prevIndex + tracksPerPage) % tracks.length)
    }

    const prevTracks = () => {
        setCurrentIndex((prevIndex) => (prevIndex - tracksPerPage + tracks.length) % tracks.length)
    }

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    return (
        <section className="p-6 bg-gradient-to-br from-gray-900 to-gray-800">
            <h2 className="text-3xl font-bold mb-6 text-white">Recently Released</h2>
            <div className="flex items-center">
                <button onClick={prevTracks} className="text-white p-4 text-2xl">&lt;</button>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tracks.slice(currentIndex, currentIndex + tracksPerPage).map((track) => (
                        <div key={track.id} className="group relative">
                            <div className="aspect-square overflow-hidden rounded-lg bg-gray-800">
                                {images[track.id] && (
                                    <img
                                        src={images[track.id]}
                                        alt={`${track.title} by ${track.artist}`}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0"
                                    >
                                        <Play className="w-4 h-4" />
                                        <span className="sr-only">Play {track.title}</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <h3 className="text-lg font-semibold text-white">{track.title}</h3>
                                <p className="text-sm text-gray-400">{track.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={nextTracks} className="text-white p-4 text-2xl">&gt;</button>
            </div>
        </section>
    )
}