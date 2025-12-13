
'use client';

import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function AppSidebar() {
  const auth = useAuth();

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center justify-center gap-2 group-data-[collapsible=icon]:hidden">
          <Clapperboard className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            Moviify
          </h1>
        </Link>
         <Link href="/" className="hidden items-center justify-center group-data-[collapsible=icon]:flex">
          <Clapperboard className="w-8 h-8 text-primary" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
      </SidebarFooter>
    </Sidebar>
  );
}
