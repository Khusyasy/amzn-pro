import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import z from 'zod'
import path from 'path'
import fs from 'fs'
import { parse } from 'csv-parse'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const BATCH_SIZE = 5_000
const DATA_DIR = path.resolve('prisma/data')
const PRODUCTS_CSV = path.join(DATA_DIR, 'amazon_products.csv')
const CATEGORIES_CSV = path.join(DATA_DIR, 'amazon_categories.csv')

const RawCategorySchema = z.object({
  id: z.coerce.number().int(),
  category_name: z.string().min(1),
})
type RawCategoryType = z.infer<typeof RawCategorySchema>

const RawProductSchema = z.object({
  asin: z.string().min(1),
  title: z.string().min(1),
  imgUrl: z.string(),
  productURL: z.string(),
  stars: z.coerce.number(),
  reviews: z.coerce.number().int(),
  price: z.coerce.number(),
  listPrice: z.coerce.number(),
  category_id: z.coerce.number().int(),
  isBestSeller: z.coerce.boolean(),
  boughtInLastMonth: z.coerce.number().int(),
})
type RawProductType = z.infer<typeof RawProductSchema>

async function seedCategories(): Promise<void> {
  const start = performance.now()
  const count = await prisma.category.count()
  if (count > 0) {
    console.log(`Categories already seeded (${count} rows)`)
    return
  }

  const parser = fs
    .createReadStream(CATEGORIES_CSV)
    .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))

  const rows: RawCategoryType[] = []
  for await (const record of parser) {
    const data = RawCategorySchema.parse(record)
    rows.push(data)
  }

  await prisma.category.createMany({
    data: rows.map((r) => {
      const { category_name, ...rr } = r
      return { ...rr, name: category_name }
    }),
    skipDuplicates: true,
  })

  const end = performance.now()
  const duration = ((end - start) / 1000).toFixed(2)
  console.log(`Categories seeded (${rows.length} rows) in ${duration}s`)
}

async function seedProducts(): Promise<void> {
  const start = performance.now()
  const count = await prisma.product.count()
  if (count > 0) {
    console.log(`Products already seeded (${count} rows)`)
    return
  }

  console.log(`Streaming Products using batch size ${BATCH_SIZE}`)

  const batch: RawProductType[] = []
  let totalInserted = 0
  let batchNum = 0

  const flush = async (rows: RawProductType[]) => {
    if (rows.length === 0) return
    batchNum++
    await prisma.product.createMany({
      data: rows.map((r) => {
        const { category_id, productURL, ...rr } = r
        return { ...rr, categoryId: category_id, productUrl: productURL }
      }),
      skipDuplicates: true,
    })
    totalInserted += rows.length
    process.stdout.write(`Batch ${batchNum} | ${totalInserted}\n`)
  }

  const parser = fs
    .createReadStream(PRODUCTS_CSV)
    .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))

  for await (const record of parser) {
    const data = RawProductSchema.parse(record)
    batch.push(data)
    if (batch.length >= BATCH_SIZE) {
      await flush(batch.splice(0, BATCH_SIZE))
    }
  }
  await flush(batch)

  const end = performance.now()
  const duration = ((end - start) / 1000).toFixed(2)
  console.log(`Products seeded (${totalInserted} rows) in ${duration}s`)
}

async function main() {
  await seedCategories()
  await seedProducts()
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
