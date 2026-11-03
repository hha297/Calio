import { Flashlight } from 'lucide-react';

import { MockStatusBar, PhoneFrame } from '@/components/mockups/phone-frame';

/** Clean barcode-scan preview — same device size as diary/workout mocks. */
export function ScanMock({
  className,
  label = 'Barcode scan',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <PhoneFrame className={className} label={label}>
      <div className="relative flex h-full flex-col bg-[#111]">
        <MockStatusBar dark />

        <div className="flex items-center justify-between px-5 pt-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Scan
            </p>
            <h3 className="font-display text-[22px] font-extrabold leading-none text-white">
              Barcode
            </h3>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-white/8 text-white/80">
            <Flashlight className="size-4" aria-hidden />
          </div>
        </div>

        {/* Camera stage — one clear focus area, no busy overlays */}
        <div className="relative mx-5 mt-4 flex-1 overflow-hidden rounded-[20px] bg-[#1a1a1a]">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 45%, #2a2a2a 0%, #161616 55%, #101010 100%)',
            }}
          />

          {/* Soft product silhouette — very light, not competing */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[28%] h-24 w-[58%] -translate-x-1/2 rounded-2xl opacity-[0.18]"
            style={{ background: 'linear-gradient(180deg, #888, #333)' }}
          />

          {/* Viewfinder corners only */}
          <div className="absolute inset-[18%]">
            <span className="absolute left-0 top-0 h-6 w-6 rounded-tl-lg border-l-[2.5px] border-t-[2.5px] border-primary" />
            <span className="absolute right-0 top-0 h-6 w-6 rounded-tr-lg border-r-[2.5px] border-t-[2.5px] border-primary" />
            <span className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-lg border-b-[2.5px] border-l-[2.5px] border-primary" />
            <span className="absolute bottom-0 right-0 h-6 w-6 rounded-br-lg border-b-[2.5px] border-r-[2.5px] border-primary" />
            <span className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-primary/80 shadow-[0_0_12px_#00d95f]" />
          </div>

          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            <span className="rounded-full bg-primary/95 px-3 py-1 text-[10px] font-bold text-on-primary">
              Looking up…
            </span>
          </div>
        </div>

        {/* Result strip — single quiet row */}
        <div className="mx-5 mb-5 mt-3 flex items-center gap-3 rounded-2xl bg-[#1c1c1c] px-3.5 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">Oat milk</p>
            <p className="mt-0.5 text-[11px] text-white/45">Open Food Facts · confirm to log</p>
          </div>
          <span className="shrink-0 text-[10px] font-bold tracking-wide text-primary">EAN-13</span>
        </div>
      </div>
    </PhoneFrame>
  );
}
