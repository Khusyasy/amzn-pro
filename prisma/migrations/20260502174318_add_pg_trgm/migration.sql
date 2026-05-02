CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX product_title_trgm_idx
ON "Product"
USING gin ("title" gin_trgm_ops);

CREATE INDEX category_name_idx
ON "Category"
USING gin ("name" gin_trgm_ops);
