import { SubscriberConfig, SubscriberArgs } from "@medusajs/medusa"

export default async function productUpsertHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const medusaId = data.id
  const medusaUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
  const payloadUrl = process.env.PAYLOAD_CMS_URL || 'http://localhost:3001'
  
  const query = container.resolve("query")
  
  const { data: [product] } = await query.graph({
    entity: "product",
    fields: ["id", "title", "description", "handle"],
    filters: {
      id: medusaId,
    },
  })

  if (!product) return

  try {
    await fetch(`${payloadUrl}/api/medusa-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product })
    })
    console.log(`Synced product ${medusaId} to Payload CMS`)
  } catch (error) {
    console.error('Error syncing to Payload:', error)
  }
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
  ],
  context: {
    subscriberId: "product-upsert-handler",
  },
}
