<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const catalog = useCatalog()

// TODO: i think vueuse here better
watch(catalog, (val) => {
  router.replace({
    name: route.name,
    params: {
      categoryId: val.c || undefined,
    },
    query: {
      page: val.page,
      size: val.size,
      q: val.q || undefined,
    },
  })
}, { deep: true })

const { data: products, status: statusProducts } = useFetch('/api/products/catalog', {
  query: computed(() => ({
    page: catalog.value.page,
    size: catalog.value.size,
    q: catalog.value.q || undefined,
    c: catalog.value.c || undefined,
  })),
})
</script>

<template>
  <div>
    <div class="p-2">
      Catalog {{ route.params.categoryId ? ' - ' + route.params.categoryId : '' }}
    </div>
    <div class="flex flex-row">
      <div class="w-32 p-2">
        <p>
          Categories
        </p>
        <p>
          Filters
        </p>
        <p>
          Something
        </p>
      </div>

      <div
        v-if="statusProducts === 'pending'"
        class="w-full h-full flex justify-center"
      >
        <UIcon
          name="lucide:loader-circle"
          class="w-10 h-10 animate-spin"
        />
      </div>

      <div
        v-else-if="products.length === 0"
        class="w-full h-full flex justify-center"
      >
        No Products Found
      </div>

      <div
        v-else
        class="flex flex-wrap justify-around gap-2 p-2"
      >
        <div
          v-for="product in products"
          :key="product.asin"
          class="w-64 m-4 rounded-xl bg-accented overflow-hidden"
        >
          <div class="w-64 h-64 overflow-hidden flex items-center justify-center bg-white">
            <img
              :src="product.imgUrl"
              :alt="product.title"
              class="h-full max-h-full max-w-full object-contain"
            >
          </div>
          <div class="px-2 pt-1 pb-2 flex flex-col justify-between gap-1">
            <div class="line-clamp-2">
              {{ product.title }}
            </div>
            <div class="flex gap-2">
              <UBadge
                :label="formatCurrency(product.price)"
              />
              <UBadge
                v-if="product.listPrice > 0"
                :label="formatCurrency(product.listPrice)"
                color="error"
                class="line-through"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
