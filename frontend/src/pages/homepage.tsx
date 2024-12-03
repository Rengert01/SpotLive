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
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import Notifications from '@/components/homepage-components/notifications';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('Music');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center">
        <SidebarTrigger className="h-9 w-9 p-0 md:hidden" />
        <Separator orientation="vertical" className="md:hidden" />
        <TabsList>
          <TabsTrigger value="Music">Music</TabsTrigger>
          <TabsTrigger value="Live">Live</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex  items-center gap-5">
          <Link to="/songs/upload">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Upload Track
            </Button>
          </Link>
          <Notifications />
        </div>
      </div>
      <TabsContent value="Music" className="space-y-6">
        <RecentlyReleasedTracks />
        <MadeForYouTracks />
      </TabsContent>
      <TabsContent value="Live">
        <Live />
      </TabsContent>
    </Tabs>
  );
}
