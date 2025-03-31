import { Button } from "@/components/ui/button";
import logo from "../../../../public/ghostpad.png";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Bell } from "lucide-react";

function Navbar() {
    return (
        <>
            <div className="flex justify-between w-full border-b p-3 bg-zinc-900">
                <div className="flex gap-2 items-center">
                    <a href="/" className="flex gap-2 items-center group ">
                        <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg group-hover:rotate-180 transition-all duration-500" />
                        <div className="font-body font-semibold text-lg">GhostPad</div>
                    </a>

                </div>
                <div className="flex gap-3 items-center">

                    <Button variant="outline" size="icon" className="w-8 h-8 bg-transparent border-none rounded-lg">
                        <Bell  />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="w-8 h-8 cursor-pointer">
                                <AvatarImage src={logo} alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Profile
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Billing
                                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Settings
                                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Keyboard shortcuts
                                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-400">
                                Log out
                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    )
}
export default Navbar;