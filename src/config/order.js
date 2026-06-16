const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || '2348153441319'

export const createWhatsAppLink = (message) => {
  const text = encodeURIComponent(message)

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

export const createGeneralOrderMessage = () => {
  return 'Hi MyPicks, I want to place an order.'
}

export const createProductOrderMessage = (product) => {
  const parts = [
    `Hi MyPicks, I want to order ${product.name}.`,
    product.price ? `Price: ${product.price}.` : '',
    product.category ? `Category: ${product.category}.` : '',
  ]

  return parts.filter(Boolean).join(' ')
}

export const createCartOrderMessage = (items, total) => {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} x${item.quantity} - ${item.lineTotal}`
  )

  return [
    'Hi MyPicks, I would like to place this order:',
    '',
    ...lines,
    '',
    `Total: ${total}`,
  ].join('\n')
}
