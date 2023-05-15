import { ChevronDown, Circle, Plus, Star } from 'lucide-react';

import { Button, buttonVariants } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Separator } from '@/app/components/ui/separator';

function DocumentCard() {
  return (
    <Card className="max-w-[500px]">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0 ]">
        <div className="space-y-1">
          <CardTitle>shadcn/ui</CardTitle>
          <CardDescription>
            Beautifully designed components built with Radix UI and Tailwind
            CSS.
          </CardDescription>
        </div>
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Button variant="secondary" className="px-3">
            <Star className="mr-2 h-4 w-4" />
            Star
          </Button>
          <Separator orientation="vertical" className="h-[20px]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="px-2">
                <ChevronDown className="h-4 w-4 text-secondary-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              alignOffset={-5}
              className="w-[200px]"
              forceMount
            >
              <DropdownMenuLabel>Suggested Lists</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Future Ideas
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>My Stack</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Inspiration</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" /> Create List
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  className={`${buttonVariants({ variant: 'ghost' })} w-full`}
                >
                  <Plus className="mr-2 h-4 w-4" /> Open Document
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  className={`${buttonVariants({ variant: 'ghost' })} w-full`}
                >
                  <Plus className="mr-2 h-4 w-4" /> Share Document
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  className={`${buttonVariants({
                    variant: 'destructive',
                  })} w-full`}
                >
                  <Plus className="mr-2 h-4 w-4" /> Delete Document
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Circle className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            TypeScipt
          </div>
          <div className="flex items-center">
            <Star className="mr-1 h-3 w-3" />
            10k
          </div>
          <div>Updated April 2023</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DocumentCard;