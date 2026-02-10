<template>
  <div :class="styles().page()">
    <Card :class="styles({ cardLayout: mobile ? 'mobile' : 'desktop' }).card()">
      <template #content>
        <div :class="styles().authForm()">
          <img src="/alwib.png" width="72" :class="styles().logo()" />
          <OverlayBadge value="alpha" severity="info" size="small">
            <h2 :class="styles().brandTitle()">Alwib Workspace</h2>
          </OverlayBadge>
          <SignUp v-if="!isLogin" @switch-to-login="isLogin = true" />
          <Login v-else @switch-to-signup="isLogin = false" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import SignUp from '@/components/auth/SignUp.vue'
import Login from '@/components/auth/Login.vue'
import OverlayBadge from 'primevue/overlaybadge'
import { tv } from 'tailwind-variants'

import { useBreakpoints } from '@/composables/useBreakpoints'
import { ref } from 'vue'

const { mobile } = useBreakpoints()

const isLogin = ref(false)

const styles = tv({
  slots: {
    page: 'flex justify-center h-screen w-screen items-center',
    card: '',
    authForm: 'auth-form flex flex-col items-center',
    logo: 'mb-2',
    brandTitle: 'text-xl mb-5',
  },
  variants: {
    cardLayout: {
      mobile: {
        card: 'w-full h-full flex justify-center rounded-0',
      },
      desktop: {
        card: 'neon',
      },
    },
  },
  defaultVariants: {
    cardLayout: 'desktop',
  },
})
</script>

<style lang="scss" scoped>
:deep(.p-card.neon) {
  position: relative;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #007700, #009e5f, #009900);
    background-size: 200% 200%;
    border-radius: 10px;
    z-index: -1;
    animation: neonBorder 10s linear infinite;
  }
}
@keyframes neonBorder {
  0% {
    background-position: 0% 50%;
    opacity: 0.3;
    box-shadow: 0 0 10px rgba(0, 158, 0, 0.5);
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
    box-shadow: 0 0 20px rgba(0, 160, 96, 0.8);
  }
  100% {
    background-position: 0% 50%;
    opacity: 0.3;
    box-shadow: 0 0 10px rgba(0, 136, 0, 0.5);
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
