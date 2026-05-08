import { useEffect, useState } from 'react'
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from 'firebase/firestore'

import {
    ref,
    uploadBytes,
    getDownloadURL,
} from 'firebase/storage'

import {
    onAuthStateChanged,
    signOut,
} from 'firebase/auth'

import { db, storage, auth } from '../../firebase/config'
import styles from './Admin.module.css'

function Admin() {
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Small Chops',
        featured: false,
    })

    const [imageFile, setImageFile] = useState(null)
    const [products, setProducts] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(false)

    // AUTH PROTECTION
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = '/login'
            }
        })

        return () => unsub()
    }, [])

    // FETCH PRODUCTS
    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, 'products'))

        const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))

        setProducts(items)
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    // FORM HANDLERS
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0])
    }

    // CREATE / UPDATE PRODUCT
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            let imageUrl = ''

            // upload image if new one selected
            if (imageFile) {
                const imageRef = ref(
                    storage,
                    `products/${imageFile.name + Date.now()}`
                )

                await uploadBytes(imageRef, imageFile)
                imageUrl = await getDownloadURL(imageRef)
            }

            const productData = {
                name: form.name,
                price: `₦${form.price}`,
                description: form.description,
                category: form.category,
                featured: form.featured,
            }

            if (imageUrl) {
                productData.image = imageUrl
            }

            // UPDATE
            if (editingId) {
                const productRef = doc(db, 'products', editingId)
                await updateDoc(productRef, productData)
                setEditingId(null)
            } else {
                // CREATE
                await addDoc(collection(db, 'products'), productData)
            }

            // reset form
            setForm({
                name: '',
                price: '',
                description: '',
                category: 'Small Chops',
            })

            setImageFile(null)

            fetchProducts()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // DELETE PRODUCT
    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'products', id))
        fetchProducts()
    }

    // EDIT PRODUCT
    const handleEdit = (product) => {
        setForm({
            name: product.name,
            price: product.price.replace('₦', ''),
            description: product.description,
            category: product.category,
        })

        setEditingId(product.id)
    }

    return (
        <div className={styles.admin}>

            {/* HEADER */}
            <div className={styles.header}>
                <h1>MyPicks Admin</h1>

                <button
                    className={styles.logout}
                    onClick={() => signOut(auth)}
                >
                    Logout
                </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className={styles.form}>

                <input
                    type="text"
                    name="name"
                    placeholder="Food name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                >
                    <option>Small Chops</option>
                    <option>Meals</option>
                    <option>Drinks</option>
                </select>


                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        name="featured"
                        checked={form.featured}
                        onChange={(e) =>
                            setForm({ ...form, featured: e.target.checked })
                        }
                    />
                    ⭐ Mark as Featured (Chef’s Pick)
                </label>

                <button disabled={loading}>
                    {editingId ? 'Update Product' : 'Add Product'}
                </button>
            </form>

            {/* PRODUCT LIST */}
            <div className={styles.list}>
                {products.map((product) => (
                    <div key={product.id} className={styles.card}>

                        <img src={product.image} alt={product.name} />

                        <div className={styles.info}>
                            <h3>
                                {product.name}
                            </h3>

                            {/* ⭐ FEATURED BADGE */}
                            {product.featured && (
                                <span className={styles.badge}>
                                    ⭐ Featured
                                </span>
                            )}

                            <p>{product.price}</p>
                        </div>

                        <div className={styles.actions}>
                            <button onClick={() => handleEdit(product)}>
                                Edit
                            </button>

                            <button onClick={() => handleDelete(product.id)}>
                                Delete
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default Admin