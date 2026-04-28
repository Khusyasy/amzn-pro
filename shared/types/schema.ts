import z from 'zod'

export const CategorySchema = z.object({
  id: z.int(),
  name: z.string(),
})
export type CategoryType = z.infer<typeof CategorySchema>

export const ProductSchema = z.object({
  asin: z.string(),
  categoryId: z.int(),
  category: CategorySchema,
  title: z.string(),
  imgUrl: z.url(),
  productUrl: z.url(),
  stars: z.float64(),
  reviews: z.int(),
  price: z.float64(),
  listPrice: z.float64(),
  isBestSeller: z.boolean(),
  boughtInLastMonth: z.int(),
})
export type ProductType = z.infer<typeof ProductSchema>
