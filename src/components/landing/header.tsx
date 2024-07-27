"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import Typography from "../ui/typography";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "../ui/theme-toggle";
import { Logo } from "../ui/icons";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Header({ className }: SidebarProps) {
  const pathname = usePathname();
  const items = [
    {
      href: "#",
      title: "Book a demo",
      openInNewTab: false,
    },
    // { href: '/pricing', title: 'Features' },
    
  ];

  const getLogo = () => (
    <Link href="/" className="pointer flex items-center">
      <Logo className="h-24 w-24 text-black dark:text-white mr-3" />
    </Link>
  );

  const getAuthButtons = () => (
    <div className="flex gap-3 items-center">
      <Link
        href="#"
      >
        <Typography variant="p">Login</Typography>
      </Link>
      <Link
        href="#"
      >
        <Button size="tiny" color="ghost">
          <Typography variant="p" className="text-white dark:text-black">
            Sign Up
          </Typography>
        </Button>
      </Link>
    </div>
  );

  const getHeaderItems = () => {
    return (
      <>
        {items.map((item) => {
          const selected =
            pathname === item.href || pathname.includes(item.href);
          return (
            <Link
              href={item.href}
              className="pointer block w-fit"
              target={item.openInNewTab ? "_blank" : ""}
              key={item.title}
            >
              <Typography
                variant="p"
                className={cn(selected && "text-primary")}
              >
                {item.title}
              </Typography>
            </Link>
          );
        })}
      </>
    );
  };

  return (
    <div
      className={cn(
        `flex md:h-12 h-20 items-center justify-center w-full
          border-b`,
        className
      )}
    >
      <div className="w-full max-w-[1280px] md:px-8 px-4">
        {/* Desktop */}
        <div className="flex items-center gap-x-8 w-full">
          <div className="md:flex-0 min-w-fit flex-1">{getLogo()}</div>
          <div className="hidden md:flex flex items-center w-full">
            <div className="flex items-center gap-x-8 flex-1">
              {getHeaderItems()}
            </div>
            <div className="pr-5">
              <ModeToggle />
            </div>
            {getAuthButtons()}
          </div>
          {/* Mobile */}
          <div className="md:hidden flex gap-x-4 items-center">
            {getAuthButtons()}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <HamburgerMenuIcon className="h-5 w-5" />
              </DrawerTrigger>
              <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-64 rounded-none">
                <div className="mx-auto w-full h-full p-5">
                  <DrawerHeader>
                    <DrawerClose asChild>
                      <div className="w-full flex items-end justify-between">
                        <ModeToggle />
                        <Button size="tiny" variant="ghost">
                          <Cross2Icon className="h-5 w-5 rotate-0 scale-100 transition-all" />
                          <span className="sr-only">Close</span>
                        </Button>
                      </div>
                    </DrawerClose>
                  </DrawerHeader>
                  <div className="p-4 pb-0 space-y-4">{getHeaderItems()}</div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}
