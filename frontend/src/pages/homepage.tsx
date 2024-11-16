import { useState } from 'react';
import RecentlyReleasedTracks from '@/components/homepage-components/recently-released.tsx';
import MadeForYouTracks from '@/components/homepage-components/made-for-you.tsx';
import { Live } from '@/pages/live';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs.tsx';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('Music');

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="Music">Music</TabsTrigger>
          <TabsTrigger value="Live">Live</TabsTrigger>
        </TabsList>
        <TabsContent value="Music">
          <RecentlyReleasedTracks />
          <MadeForYouTracks />
        </TabsContent>
        <TabsContent value="Live">
          <Live />
        </TabsContent>
      </Tabs>
    </div>
  );
}
