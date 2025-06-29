import { cn } from '@/lib/utils';
import { IconSchool } from '@tabler/icons-react';

export default function ApplicationLogo({ bgLogo, colorLogo, colorText }) {
    return (
        <div href="#" className={cn('flex flex-row items-center gap-x-2')}>
            <div
                className={cn(
                    'flex aspect-square size-12 items-center justify-center rounded-full bg-gradient-to-r text-foreground',
                    bgLogo,
                )}
            >
                <IconSchool className={cn('size-8', colorLogo)} />
            </div>
            <div className={cn('grid flex-1 text-left leading-tight', colorText)}>
                <span className="truncate font-bold">Kelompok 1</span>
                <span className="truncate text-xs tracking-tighter">Pondok informatika Kelompok 1</span>
            </div>
        </div>
    );
}
