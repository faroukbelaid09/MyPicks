import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

import { db } from './db'

export const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, 'products'))

  const products = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
    .filter(product => product.available !== false)
    .sort((a, b) => {
      const orderA = Number(a.sortOrder ?? 0)
      const orderB = Number(b.sortOrder ?? 0)

      if (orderA !== orderB) {
        return orderA - orderB
      }

      return String(a.name || '').localeCompare(String(b.name || ''))
    })

  return products
}

export const fetchSiteContent = async () => {
  const contentSnapshot = await getDoc(doc(db, 'siteContent', 'homepage'))

  return contentSnapshot.exists() ? contentSnapshot.data() : {}
}
