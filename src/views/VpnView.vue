<template>
  <div class="vpn flex flex-col p-[30px] gap-[30px]">
    <!-- Первый блок на всю ширину -->
    <Block>
      <template #header>
        <div class="vpn">
          <h1>Добро пожаловать в VPN</h1>
        </div>
      </template>
    </Block>

    <!-- Контейнер для двух блоков в одной строке -->
    <div class="flex justify-between">
      <div class="w-[48%]"> <!-- Немного меньше 50% для отступов -->
        <VpnStatistic
          :status="true"
          :traffic="1.5"
          date="Неограничено"
        />
      </div>
      <div class="w-[48%]">
        <VpnCopy />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Block from '@/components/app/Block.vue'
import VpnStatistic from '@/components/vpn/VpnStatistic.vue';
import VpnCopy from '@/components/vpn/VpnCopy.vue';

</script>

<style lang="scss" scoped></style>
