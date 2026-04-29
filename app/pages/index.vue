<script setup lang="ts">
const { data: pmetas } = useFetch('/api/products/meta')
const { data: cmetas } = useFetch('/api/categories/meta')

const { data: best } = useFetch('/api/products/best')

const { data: trendingCategories } = useFetch('/api/categories/trending')
const trendingCards = computed(() => {
  if (!trendingCategories.value) return []

  return trendingCategories.value.map((cat) => {
    return {
      title: '' + cat.name,
      description: `${formatCompact(cat.boughtInLastMonth)} products bought in the last month`,
      to: `/catalog/${cat.id}`,
      icon: 'lucide:package-search',
    }
  })
})
</script>

<template>
  <div>
    <div class="p-4 w-full text-xl bg-neutral-300/30 flex items-center justify-center gap-1">
      Explore
      <UBadge
        size="xl"
        variant="subtle"
        color="primary"
        :label="formatCount(pmetas?._count)"
      />
      products in
      <UBadge
        size="xl"
        variant="subtle"
        color="secondary"
        :label="formatCount(cmetas?._count)"
      />
      categories
    </div>

    <!-- TODO: best sellers -->
    <UPageHero
      v-if="best"
      :title="best.title"
      headline="Best Seller"
      orientation="horizontal"
      :links="[{
        label: 'See Details',
        to: best.productUrl,
        target: '_blank',
        size: 'xl',
        color: 'neutral',
        variant: 'solid',
      }, {
        label: 'Buy Now!',
        to: best.productUrl,
        target: '_blank',
        icon: 'i-lucide-shopping-cart',
        size: 'xl',
        color: 'primary',
        variant: 'solid',
      }]"
    >
      <template #description>
        <div class="flex flex-row gap-4">
          <div class="flex gap-2">
            <UBadge
              size="xl"
              :label="formatCurrency(best.price)"
            />
            <UBadge
              v-if="best.listPrice > 0"
              size="xl"
              :label="formatCurrency(best.listPrice)"
              color="error"
              variant="subtle"
              class="line-through"
            />
          </div>
          <div class="flex gap-1 justify-center items-center">
            <Icon
              name="lucide:message-square-heart"
              size="24"
            /> {{ formatCount(best.reviews) }}
          </div>
          <div class="flex gap-1 justify-center items-center">
            <Icon
              name="lucide:star"
              size="24"
            /> {{ best.stars }}
          </div>
        </div>
      </template>

      <NuxtImg
        :src="best.imgUrl"
        class="rounded-lg shadow-2xl ring ring-default w-full "
      />
    </UPageHero>

    <!-- TODO: best categories -->
    <UPageSection
      title="Trending Categories"
    >
      <UPageGrid>
        <UPageCard
          v-for="(card, index) in trendingCards"
          :key="index"
          v-bind="card"
        />
      </UPageGrid>
    </UPageSection>

    <!-- TODO: explore / search -->
    <UPageSection>
      <UPageCTA
        title="Ready to find your perfect products?"
        description="Join thousands of customers shopping with AmznPro. Search and start shipping today."
        variant="subtle"
      >
        <UForm
          method="GET"
          action="."
          class="mx-10 flex flex-row justify-center items-center"
        >
          <UInput
            icon="lucide:search"
            size="xl"
            class="w-full"
          />
          <UButton
            type="submit"
            size="xl"
            icon="lucide:send-horizontal"
          />
        </UForm>
      </UPageCTA>
    </UPageSection>
  </div>
</template>
