import { useLocation } from 'react-router-dom';
import TracksSearchResults from '@/components/search-components/tracks-search-results';
import ArtistSearchResults from '@/components/search-components/artist-search-results';

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function Search() {
    // const query = useQuery();
    // const searchQuery = query.get('query') || '';

    return (
        <div>
            <TracksSearchResults />
            <ArtistSearchResults />
        </div>
    );
}