import { useLocation } from 'react-router-dom';
import FilteredTracks from '@/components/filtered-tracks';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Search() {
  const query = useQuery();
  const searchQuery = query.get('query') || '';

  return (
    <div>
      <FilteredTracks
        title="Tracks"
        subtitle={`Tracks matching "${searchQuery}"`}
        searchQuery={searchQuery}
        filterType="title"
      />
      <FilteredTracks
        title="Artists"
        subtitle={`Artists matching "${searchQuery}"`}
        searchQuery={searchQuery}
        filterType="artist"
      />
    </div>
  );
}
