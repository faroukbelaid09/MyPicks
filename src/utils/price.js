export const getPriceAmount = (price) => {
  if (typeof price === 'number') {
    return price
  }

  const normalized = String(price || '')
    .replace(/,/g, '')
    .match(/\d+(?:\.\d+)?/)

  return normalized ? Number(normalized[0]) : 0
}

export const formatPrice = (price) => {
  const amount = getPriceAmount(price)

  if (!amount && amount !== 0) {
    return String(price || '')
  }

  return `₦${amount.toLocaleString('en-NG')}`
}
