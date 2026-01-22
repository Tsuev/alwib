<template>
  <div class="space-y-6 p-6">
    <!-- Welcome Section -->
    <section class="flex flex-col gap-4">
      <div>
        <h1 class="text-4xl font-bold text-white">Добро пожаловать! 👋</h1>
        <p class="mt-2 text-slate-400">
          Здесь вы можете управлять всеми своими сервисами в одном месте
        </p>
      </div>
    </section>

    <!-- Stats Grid -->
    <section class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-400">Баланс</p>
            <p class="text-2xl font-bold text-white">1250.50 ₽</p>
          </div>
          <i class="pi pi-wallet text-3xl text-primary-400"></i>
        </div>
        <div class="mt-4 h-1 bg-primary-500/30 rounded-full overflow-hidden">
          <div class="h-full w-3/4 bg-primary-500"></div>
        </div>
        <p class="mt-2 text-xs text-slate-500">↑ 12% от прошлого месяца</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-400">VPN Сессии</p>
            <p class="text-2xl font-bold text-white">3 активные</p>
          </div>
          <i class="pi pi-shield text-3xl text-emerald-400"></i>
        </div>
        <p class="mt-4 text-xs text-emerald-400">Все соединения стабильны</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-400">ИИ Запросы</p>
            <p class="text-2xl font-bold text-white">247 / 500</p>
          </div>
          <i class="pi pi-comment text-3xl text-blue-400"></i>
        </div>
        <div class="mt-4 h-1 bg-blue-500/30 rounded-full overflow-hidden">
          <div class="h-full w-1/2 bg-blue-500"></div>
        </div>
        <p class="mt-2 text-xs text-slate-500">49% использовано</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-400">Загрузки</p>
            <p class="text-2xl font-bold text-white">12 файлов</p>
          </div>
          <i class="pi pi-cloud-download text-3xl text-orange-400"></i>
        </div>
        <p class="mt-4 text-xs text-slate-500">Общий размер: 2.4 GB</p>
      </div>
    </section>

    <!-- Quick Actions -->
    <section>
      <h2 class="text-xl font-semibold text-white mb-4">Быстрые действия</h2>
      <div class="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <button class="action-btn">
          <i class="pi pi-shield text-xl"></i>
          <span>Включить VPN</span>
        </button>
        <button class="action-btn">
          <i class="pi pi-comment text-xl"></i>
          <span>Написать ИИ</span>
        </button>
        <button class="action-btn">
          <i class="pi pi-cloud-download text-xl"></i>
          <span>Загрузить файл</span>
        </button>
        <button class="action-btn">
          <i class="pi pi-cog text-xl"></i>
          <span>Настройки</span>
        </button>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="grid gap-6 grid-cols-1 lg:grid-cols-3">
      <div class="lg:col-span-2 activity-card">
        <h3 class="text-lg font-semibold text-white mb-4">Недавняя активность</h3>
        <div class="space-y-3">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="flex items-center gap-3">
              <i :class="[activity.icon, 'text-lg', activity.color]"></i>
              <div class="flex-1">
                <p class="text-sm text-white">{{ activity.title }}</p>
                <p class="text-xs text-slate-500">{{ activity.time }}</p>
              </div>
              <span :class="['px-2 py-1 rounded text-xs font-medium', activity.badgeClass]">
                {{ activity.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Info -->
      <div class="activity-card">
        <h3 class="text-lg font-semibold text-white mb-4">Подписка</h3>
        <div class="space-y-4">
          <div class="subscription-badge">
            <span class="text-xs text-slate-400">ПЛАН</span>
            <p class="text-lg font-bold text-white">Pro</p>
          </div>
          <div class="subscription-badge">
            <span class="text-xs text-slate-400">СЛЕДУЮЩЕЕ ПРОДЛЕНИЕ</span>
            <p class="text-lg font-bold text-white">12 февраля</p>
          </div>
          <div class="subscription-badge">
            <span class="text-xs text-slate-400">ДНЕЙ ОСТАЛОСЬ</span>
            <p class="text-lg font-bold text-primary-400">20 дней</p>
          </div>
          <button class="w-full mt-4 px-4 py-2 rounded-lg border border-primary-500 text-primary-400 hover:bg-primary-500/10 transition text-sm font-medium">
            Управлять подпиской
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const recentActivities = ref([
  {
    id: 1,
    title: 'Подключение к VPN серверу',
    time: '10 минут назад',
    status: 'Успешно',
    icon: 'pi pi-check-circle',
    color: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    id: 2,
    title: 'ИИ запрос обработан',
    time: '1 час назад',
    status: 'Выполнено',
    icon: 'pi pi-check-circle',
    color: 'text-blue-400',
    badgeClass: 'bg-blue-500/20 text-blue-300',
  },
  {
    id: 3,
    title: 'Файл загружен',
    time: '3 часа назад',
    status: 'Завершено',
    icon: 'pi pi-cloud-download',
    color: 'text-orange-400',
    badgeClass: 'bg-orange-500/20 text-orange-300',
  },
  {
    id: 4,
    title: 'Обновление настроек',
    time: 'Вчера',
    status: 'Применено',
    icon: 'pi pi-cog',
    color: 'text-slate-400',
    badgeClass: 'bg-slate-500/20 text-slate-300',
  },
])
</script>

<style lang="scss" scoped>
.stat-card {
  @apply rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-950/50 p-6 transition hover:border-slate-700/80 hover:bg-gradient-to-br hover:from-slate-900 hover:to-slate-950;
  backdrop-filter: blur(10px);
}

.action-btn {
  @apply flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-slate-200 transition hover:border-primary-500/50 hover:bg-primary-500/10 hover:text-white;
  cursor: pointer;

  i {
    @apply text-primary-400;
  }

  &:hover {
    i {
      @apply text-primary-300;
    }
  }
}

.activity-card {
  @apply rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-950/50 p-6;
  backdrop-filter: blur(10px);
}

.activity-item {
  @apply rounded-xl border border-slate-800/30 bg-slate-900/20 p-4 transition hover:border-slate-700/50 hover:bg-slate-900/40;
}

.subscription-badge {
  @apply rounded-lg border border-slate-800/60 bg-slate-900/30 p-3;

  span {
    @apply block text-xs font-semibold uppercase tracking-wider text-slate-500;
  }

  p {
    @apply mt-1;
  }
}
</style>
