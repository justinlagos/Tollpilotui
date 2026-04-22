Right now the car image feels like a photo dropped into the UI.

Instead:

the car should sit inside a dedicated reveal stage
the stage should create the premium moment
the image should not feel like a random card
Fix 2: the glow should wrap the reveal stage, not the photo itself

The glow is part of the experience, not part of the asset.

Fix 3: the car image needs one consistent behavior
full height inside frame
object-fit contain
subtle float animation
no hard crop unless stylistically intentional
Fix 4: button and note should sit lower with more breathing room

The current screen is a little cramped vertically.

3. Exact Tailwind classes for the car reveal component

If your prototype uses Tailwind, use this.

Outer stage
<div class="relative mx-auto mt-4 w-[320px]">
  <div class="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_center,rgba(253,197,0,0.16),rgba(59,130,255,0.12),transparent_72%)] blur-2xl"></div>

  <div class="relative flex min-h-[420px] items-center justify-center rounded-[36px] border border-white/6 bg-transparent px-4 py-6">
    <img
      src="/assets/vehicles/generic_sports_black.webp"
      alt="Registered vehicle preview"
      class="h-[360px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] animate-[carFloat_3.2s_ease-in-out_infinite]"
    />
  </div>
</div>
Full layout with Tailwind
<section class="min-h-screen bg-[#060A14] px-6 pb-8 pt-6 text-white">
  <div class="flex justify-end">
    <button class="text-[18px] font-semibold text-[#94A3B8]">Skip</button>
  </div>

  <div class="mt-8 text-center">
    <h1 class="text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
      Which one's yours?
    </h1>
    <p class="mx-auto mt-4 max-w-[320px] text-[16px] leading-8 text-[#94A3B8]">
      We'll check MOT, tax and ULEZ compliance automatically.
    </p>
  </div>

  <div class="mt-8">
    <div class="mx-auto flex h-[84px] w-full max-w-[600px] items-center overflow-hidden rounded-[22px] border-[3px] border-[#0B0B0B] bg-[#FDC500] shadow-[0_16px_32px_rgba(253,197,0,0.18)]">
      <div class="flex h-full w-[92px] flex-col items-center justify-center bg-[#1D4ED8] text-white">
        <span class="text-[14px] font-bold leading-none">✶</span>
        <span class="mt-2 text-[18px] font-extrabold tracking-[0.04em]">GB</span>
      </div>

      <div class="flex flex-1 items-center justify-center">
        <span class="font-mono text-[34px] font-extrabold tracking-[0.14em] text-[#111111]">
          DS67JUY
        </span>
        <span class="ml-2 inline-block h-[46px] w-[2px] bg-[#111111] animate-pulse"></span>
      </div>
    </div>

    <div class="mt-5 flex items-center justify-center gap-3 text-center">
      <span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#22C55E] text-[22px] font-bold text-white">
        ✓
      </span>
      <span class="text-[16px] font-semibold text-[#22C55E]">
        Looks good — this is your registered vehicle
      </span>
    </div>
  </div>

  <div class="relative mx-auto mt-6 w-[320px]">
    <div class="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_center,rgba(253,197,0,0.16),rgba(59,130,255,0.12),transparent_72%)] blur-2xl"></div>

    <div class="relative flex min-h-[420px] items-center justify-center rounded-[36px] px-4 py-6">
      <img
        src="/assets/vehicles/generic_sports_black.webp"
        alt="Registered vehicle preview"
        class="h-[360px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] animate-[carFloat_3.2s_ease-in-out_infinite]"
      />
    </div>
  </div>

  <div class="mt-3 flex items-center justify-center gap-2">
    <span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
    <span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
    <span class="h-2.5 w-14 rounded-full bg-[#3BA9FF]"></span>
  </div>

  <button class="mt-8 flex h-20 w-full items-center justify-center gap-4 rounded-[22px] bg-[#FDC500] text-[22px] font-extrabold text-[#111111] shadow-[0_18px_40px_rgba(253,197,0,0.18)] transition-transform duration-200 active:scale-[0.98]">
    <span class="text-[28px]">⌕</span>
    <span>Look up vehicle</span>
  </button>

  <p class="mt-8 text-center text-[14px] text-[#64748B]">
    Powered by DVLA · Data updated daily
  </p>
</section>
Tailwind custom animation you need

Add this in your Tailwind config or global CSS:

@keyframes carFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

If you want a more premium feel:

@keyframes carFloat {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.01);
  }
}
4. Plain CSS version for the car component

If your dev is not relying fully on Tailwind, use this.

HTML
<div class="vehicle-reveal-stage">
  <div class="vehicle-glow"></div>

  <div class="vehicle-frame">
    <img
      src="/assets/vehicles/generic_sports_black.webp"
      alt="Registered vehicle preview"
      class="vehicle-car-image"
    />
  </div>
</div>
CSS
.vehicle-reveal-stage {
  position: relative;
  width: 320px;
  margin: 24px auto 0;
}

.vehicle-glow {
  position: absolute;
  inset: 0;
  border-radius: 36px;
  background: radial-gradient(
    circle at center,
    rgba(253, 197, 0, 0.16),
    rgba(59, 130, 255, 0.12),
    transparent 72%
  );
  filter: blur(28px);
  pointer-events: none;
}

.vehicle-frame {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  border-radius: 36px;
}

.vehicle-car-image {
  width: auto;
  height: 360px;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.45));
  animation: tollpilotCarFloat 3.2s ease-in-out infinite;
}

@keyframes tollpilotCarFloat {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.01);
  }
}
5. If you want the car to appear only after plate validation

This is the best flow.

HTML
<div class="vehicle-reveal-stage is-hidden" id="vehicleReveal">
  <div class="vehicle-glow"></div>
  <div class="vehicle-frame">
    <img
      src="/assets/vehicles/generic_sports_black.webp"
      alt="Registered vehicle preview"
      class="vehicle-car-image"
    />
  </div>
</div>
CSS
.vehicle-reveal-stage {
  position: relative;
  width: 320px;
  margin: 24px auto 0;
  opacity: 1;
  transform: translateY(0);
  transition: opacity 220ms ease-out, transform 220ms ease-out;
}

.vehicle-reveal-stage.is-hidden {
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
}
JS
const plateInput = document.querySelector('#plateInput')
const vehicleReveal = document.querySelector('#vehicleReveal')

function onPlateValidated() {
  vehicleReveal.classList.remove('is-hidden')
}
6. Best practice for the specific screen you showed

For your exact screen:

Keep
headline
plate treatment
validation line
CTA position
DVLA footer
Change
remove the rectangular photo feel
remove hard crop
use transparent asset
wrap car in premium reveal stage
reduce visual mess around the image
make the car feel like a resolved object, not a pasted image
7. Strong recommendation on the asset itself

The asset in your screenshot is still reading as:

cropped photo
background included
not product-grade

Use instead:

transparent 3D rendered car
full silhouette visible
same angle across app
same lighting across app

Even if it’s not exact, the consistency will make it feel expensive.

8. Final implementation note for your dev

Tell the dev this plainly:

The car component is not a regular image block
It is a resolved vehicle visual state
It must sit inside a reveal stage
The reveal stage owns the glow, motion, and premium feeling
The car image itself should stay clean and background-free