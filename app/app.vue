<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

const title = 'Nuxt Starter Template'
const description = 'A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image',
})

const { data: categories, status: statusCategories } = useFetch('/api/categories')
const itemsCategories = computed(() => {
  if (!categories.value) return []
  return [
    { id: -1, name: 'All' },
    ...categories.value,
  ]
})
const selectedCategories = ref<CategoryType>({ id: -1, name: 'All' })

const itemsNav = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    icon: 'i-lucide-book-open',
    active: route.path === '/',
  },
  {
    label: 'Catalog',
    to: '/catalog',
    icon: 'i-lucide-box',
    active: route.path.startsWith('/catalog'),
  },
])
</script>

<template>
  <UApp>
    <UHeader
      mode="slideover"
      :ui="{
        left: 'lg:flex-initial lg:basis-auto',
        center: 'flex-1 flex items-center justify-center',
        right: 'lg:flex-initial lg:basis-auto',
        toggle: 'lg:block',
        content: 'lg:block',
      }"
    >
      <template #left>
        <NuxtLink
          to="/"
          class="text-2xl"
        >
          <span class="text-primary">
            Amzn
          </span>
          <span class="text-secondary">
            Pro
          </span>
        </NuxtLink>
      </template>

      <div class="flex-1 flex w-full max-w-2xl">
        <UFieldGroup
          class="w-full"
        >
          <USelectMenu
            v-model="selectedCategories"
            label-key="name"
            :items="itemsCategories"
            :loading="statusCategories === 'pending'"
            placeholder="Categories"
            :ui="{ content: 'min-w-fit' }"
            :content="{
              align: 'start',
            }"
            :search-input="false"
            color="neutral"
            size="xl"
          />
          <UInput
            class="w-full"
            placeholder="Seach AmznPro"
            size="xl"
          />
          <UButton
            icon="lucide:search"
            size="xl"
          />
        </UFieldGroup>
      </div>

      <template #right>
        <UColorModeButton />
      </template>

      <template #body>
        <UNavigationMenu
          :items="itemsNav"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI - {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
