import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect } from 'react';
import axios from '@/config/axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useUserStore } from '@/stores/user-store';
import { Sidebar } from '@/components/ui/sidebar';

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

const playlists = [
  'Recently Added',
  'Recently Played',
  'Top Songs',
  'Top Albums',
  'Top Artists',
  'Logic Discography',
  'Bedtime Beats',
  'Feeling Happy',
  'I miss Y2K Pop',
  'Runtober',
  'Mellow Days',
  'Eminem Essentials',
];

export function AppSidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const { user, setUser, clearUser } = useUserStore();
  const port = 'http://localhost:3001';

  useEffect(() => {
    //Todo: Convert this to a custom auth hook
    const fetchSession = async () => {
      try {
        const res = await axios.get('/api/auth/session');
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSession();
  }, [setUser]);

  const handleLogout = async () => {
    axios
      .post('/api/auth/signOut')
      .then(() => {
        navigate('/login');
        toast({
          title: 'Logout Successful',
          description: 'You have successfully logged out!',
        });
        clearUser();
      })

      .catch((error) => {
        toast({
          title: 'Operation Failed',
          description: error.response.data.message,
        });
      });
  };

  const location = useLocation();

  console.log(location.pathname);

  return (
    <Sidebar className={cn('', className)}>
      <div className="h-full space-y-4 pt-4 flex flex-col justify-between">
        <div className="flex flex-col h-full">
          <div className="px-3 py-2 flex-initial">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Discover
            </h2>
            <div className="space-y-1">
              <Link to="/">
                <Button
                  variant={location.pathname === '/' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                  Listen Now
                </Button>
              </Link>
            </div>
          </div>

          <div className="py-2 flex-initial">
            <h2 className="relative px-7 text-lg font-semibold tracking-tight mb-1">
              Playlists
            </h2>
            <ScrollArea className="px-1 h-[350px]">
              <div className="space-y-1 p-2">
                {playlists?.map((playlist, i) => (
                  <Button
                    key={`${playlist}-${i}`}
                    variant={
                      location.pathname === `/playlist/${playlist}`
                        ? 'secondary'
                        : 'ghost'
                    }
                    className="w-full justify-start font-normal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M21 15V6" />
                      <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                      <path d="M12 12H3" />
                      <path d="M16 6H3" />
                      <path d="M12 18H3" />
                    </svg>
                    {playlist}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="px-3 py-1 flex-auto content-end">
            <div className="space-y-1">
              <Button
                variant={location.pathname === '/live' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                  <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                  <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
                </svg>
                Livestream
              </Button>

              <Link to="/profile/songs">
                <Button
                  variant={
                    location.pathname === '/profile/songs'
                      ? 'secondary'
                      : 'ghost'
                  }
                  className="w-full justify-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <circle cx="8" cy="18" r="4" />
                    <path d="M12 18V2l7 4" />
                  </svg>
                  My Music
                </Button>
              </Link>

              <Link to="/profile/albums">
                <Button
                  variant={
                    location.pathname === '/profile/albums'
                      ? 'secondary'
                      : 'ghost'
                  }
                  className="w-full justify-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="m16 6 4 14" />
                    <path d="M12 6v14" />
                    <path d="M8 8v12" />
                    <path d="M4 4v16" />
                  </svg>
                  My Albums
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="h-16 border-y">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-full w-full flex justify-center p-3">
              <div className=" flex gap-4 items-center">
                <Avatar>
                  <AvatarImage src={`${port}${user?.image}`} />
                  <AvatarFallback>
                    {user.username !== ''
                      ? user.username?.[0].toUpperCase()
                      : ''}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0">
                  <p className="text-start text-sm font-semibold">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-start text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[250px]">
              <Link className="w-full justify-start" to={'/profile'}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleLogout}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Sidebar>
  );
}
