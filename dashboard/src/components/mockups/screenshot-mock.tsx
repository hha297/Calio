import Image from 'next/image';

import { PhoneFrame } from '@/components/mockups/phone-frame';
import { cn } from '@/lib/utils';

type ScreenshotMockProps = {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  glow?: boolean;
  priority?: boolean;
};

/** Real app screenshot inside the device frame. */
export function ScreenshotMock({
  src,
  alt,
  label,
  className,
  glow = false,
  priority = false,
}: ScreenshotMockProps) {
  return (
    <PhoneFrame className={className} label={label} glow={glow}>
      <div className={cn('relative h-full w-full bg-[#202020]')}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 400px) 100vw, 340px"
          className="object-cover object-top"
          priority={priority}
        />
      </div>
    </PhoneFrame>
  );
}
