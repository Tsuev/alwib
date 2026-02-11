<template>
  <div :class="preload()">
    <div :class="glow()"></div>
    <div :class="logoWrap()">
      <img src="/alwib.png" alt="Alwib" :class="logo()" />
      <span :class="label()">Alwib Workspace</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tv } from 'tailwind-variants'

const styles = tv({
  slots: {
    preload: ['preload'],
    glow: ['glow'],
    logoWrap: ['logo-wrap'],
    logo: ['logo'],
    label: ['label'],
  },
})

const { preload, glow, logoWrap, logo, label } = styles()
</script>

<style scoped lang="scss">
.preload {
  @apply relative flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-950;
}

.glow {
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(circle at 20% 20%, rgba(0, 158, 96, 0.35), transparent 45%),
    radial-gradient(circle at 80% 30%, rgba(0, 200, 100, 0.35), transparent 40%),
    radial-gradient(circle at 50% 80%, rgba(0, 120, 70, 0.45), transparent 45%);
  filter: blur(30px);
  animation: pulseGlow 6s ease-in-out infinite;
}

.logo-wrap {
  @apply relative z-10 flex flex-col items-center gap-3;
}

.logo {
  width: 96px;
  height: 96px;
  object-fit: contain;
  animation: logoFloat 4s ease-in-out infinite;
  filter: drop-shadow(0 0 24px rgba(0, 200, 120, 0.5));
}

.label {
  @apply text-sm uppercase tracking-[0.3em] text-slate-200;
}

@keyframes pulseGlow {
  0% {
    transform: scale(1);
    opacity: 0.55;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.55;
  }
}

@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
