-- Update published INR prices while retaining existing billing terms and entitlements.
UPDATE "ProductPrice" AS price
SET "amount" = CASE price."edition"
  WHEN 'STARTER' THEN 999
  WHEN 'PLUS' THEN 1999
END, "updatedAt" = CURRENT_TIMESTAMP
FROM "Product" AS product
WHERE price."productId" = product."id"
  AND product."status" = 'ACTIVE'
  AND price."isActive" = true
  AND price."currency" = 'INR'
  AND price."edition" IN ('STARTER', 'PLUS');
