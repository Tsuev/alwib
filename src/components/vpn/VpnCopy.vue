<template>
  <Block class="bg-[#1e1e1e] text-gray-100 rounded-lg overflow-hidden h-[250px]">
    <template #header>
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <h2 class="text-lg font-semibold">Ключ VPN подключения</h2>
        <button
          @click="copyToClipboard"
          class="p-2 rounded-md hover:bg-[#2d2d2d] transition-colors group"
          :title="copied ? 'Скопировано!' : 'Копировать в буфер'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-400 group-hover:text-green-400 transition-colors"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    </template>

    <div class="p-6">
      <div class="relative">
        <pre class="p-4 bg-[#252525] rounded-md overflow-x-auto text-green-400 font-mono text-sm select-all">{{ vpnKey }}</pre>
        <transition name="fade">
          <div
            v-if="copied"
            class="absolute top-2 right-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-md"
          >
            Скопировано!
          </div>
        </transition>
      </div>

      <p class="mt-3 text-sm text-gray-400">
        Используйте этот ключ для настройки VPN подключения
      </p>
    </div>
  </Block>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Block from '../app/Block.vue';

interface Props {
  keyValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  keyValue: 'vpn-xxxx-xxxx-xxxx-xxxx-xxxx'
});

const vpnKey = ref(props.keyValue);
const copied = ref(false);

const copyToClipboard = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(vpnKey.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err: unknown) {
    console.error('Ошибка при копировании:', err instanceof Error ? err.message : String(err));
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.select-all {
  user-select: all;
  -webkit-user-select: all;
}
</style>
