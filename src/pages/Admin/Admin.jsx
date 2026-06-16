import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    deleteField,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from 'firebase/firestore'

import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage'

import {
    onAuthStateChanged,
    signOut,
} from 'firebase/auth'

import { auth } from '../../firebase/auth'
import { db } from '../../firebase/db'
import { storage } from '../../firebase/storage'
import styles from './Admin.module.css'

const emptyForm = {
    name: '',
    price: '',
    description: '',
    category: 'Small Chops',
    featured: false,
    available: true,
    sortOrder: '',
    type: 'card',
}

const imageCompression = {
    maxSize: 1400,
    quality: 0.78,
}

const PRODUCTS_CACHE_KEY = 'mypicks_products_cache'
const SITE_CONTENT_CACHE_KEY = 'mypicks_site_content_cache'

const getProductImages = (product) => {
    const gallery = Array.isArray(product?.gallery)
        ? product.gallery.filter(Boolean)
        : []

    return [
        product?.image,
        ...gallery,
    ].filter(Boolean)
}

function LoadingLabel({ text }) {
    return (
        <span className={styles.loadingLabel}>
            <span className={styles.spinner} aria-hidden="true" />
            {text}
        </span>
    )
}

function Admin() {
    const navigate = useNavigate()
    const productFormRef = useRef(null)
    const toastTimeoutRef = useRef(null)
    const [form, setForm] = useState(emptyForm)
    const [imageFile, setImageFile] = useState(null)
    const [galleryFiles, setGalleryFiles] = useState([])
    const [galleryUrls, setGalleryUrls] = useState([])
    const [products, setProducts] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [siteImages, setSiteImages] = useState({
        heroImage: '',
        aboutImage: '',
    })
    const [heroImageFile, setHeroImageFile] = useState(null)
    const [aboutImageFile, setAboutImageFile] = useState(null)
    const [siteImagesLoading, setSiteImagesLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const [confirmDeleteProduct, setConfirmDeleteProduct] = useState(null)
    const [adminSearch, setAdminSearch] = useState('')
    const [adminStatusFilter, setAdminStatusFilter] = useState('all')

    const showToast = (message, type = 'success') => {
        window.clearTimeout(toastTimeoutRef.current)
        setToast({ message, type })

        toastTimeoutRef.current = window.setTimeout(() => {
            setToast(null)
        }, 3600)
    }

    const sortedProducts = useMemo(
        () =>
            [...products].sort((a, b) => {
                const orderA = Number(a.sortOrder ?? 0)
                const orderB = Number(b.sortOrder ?? 0)

                if (orderA !== orderB) {
                    return orderA - orderB
                }

                return String(a.name || '').localeCompare(String(b.name || ''))
            }),
        [products]
    )

    const visibleProducts = useMemo(() => {
        const search = adminSearch.trim().toLowerCase()

        return sortedProducts.filter(product => {
            const matchesSearch = !search ||
                [
                    product.name,
                    product.category,
                    product.price,
                    product.type,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(search)

            const matchesStatus =
                adminStatusFilter === 'all' ||
                (adminStatusFilter === 'available' && product.available !== false) ||
                (adminStatusFilter === 'hidden' && product.available === false)

            return matchesSearch && matchesStatus
        })
    }, [adminSearch, adminStatusFilter, sortedProducts])

    useEffect(() => {
        return () => window.clearTimeout(toastTimeoutRef.current)
    }, [])

    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, 'products'))

            const items = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

        setProducts(items)
    }

    const fetchSiteImages = async () => {
        const contentSnapshot = await getDoc(
            doc(db, 'siteContent', 'homepage')
        )

        if (contentSnapshot.exists()) {
            const data = contentSnapshot.data()

            setSiteImages({
                heroImage: data.heroImage || '',
                aboutImage: data.aboutImage || '',
            })
        }
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login', { replace: true })
                return
            }

            fetchProducts()
            fetchSiteImages()
        })

        return () => unsub()
    }, [navigate])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleImageChange = (e) => {
        setImageFile(e.target.files?.[0] || null)
    }

    const handleGalleryChange = (e) => {
        setGalleryFiles(Array.from(e.target.files || []))
    }

    const getProductGallery = (product) => {
        const gallery = Array.isArray(product.gallery)
            ? product.gallery.filter(Boolean)
            : []

        if (!product.image) {
            return gallery
        }

        return [
            product.image,
            ...gallery.filter(url => url !== product.image),
        ]
    }

    const handleRemoveGalleryImage = (url) => {
        setGalleryUrls(prev => prev.filter(item => item !== url))
    }

    const handleMoveGalleryImage = (index, direction) => {
        setGalleryUrls(prev => {
            const nextIndex = index + direction

            if (nextIndex < 0 || nextIndex >= prev.length) {
                return prev
            }

            const next = [...prev]
            const [item] = next.splice(index, 1)
            next.splice(nextIndex, 0, item)

            return next
        })
    }

    const loadImage = (file) => {
        return new Promise((resolve, reject) => {
            const image = new Image()
            const url = URL.createObjectURL(file)

            image.onload = () => {
                URL.revokeObjectURL(url)
                resolve(image)
            }

            image.onerror = () => {
                URL.revokeObjectURL(url)
                reject(new Error('Could not load image for compression.'))
            }

            image.src = url
        })
    }

    const canvasToBlob = (canvas, mimeType, quality) => {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob)
                    } else {
                        reject(new Error('Could not compress image.'))
                    }
                },
                mimeType,
                quality
            )
        })
    }

    const compressImage = async (file) => {
        if (!file.type.startsWith('image/')) {
            return file
        }

        const image = await loadImage(file)
        const scale = Math.min(
            1,
            imageCompression.maxSize / Math.max(image.width, image.height)
        )
        const width = Math.round(image.width * scale)
        const height = Math.round(image.height * scale)
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const keepsTransparency = file.type === 'image/png' ||
            file.type === 'image/webp'
        const mimeType = keepsTransparency ? file.type : 'image/jpeg'
        const extension = mimeType.split('/')[1]

        canvas.width = width
        canvas.height = height
        context.drawImage(image, 0, 0, width, height)

        const blob = await canvasToBlob(
            canvas,
            mimeType,
            imageCompression.quality
        )

        if (blob.size >= file.size) {
            return file
        }

        const compressedName = file.name.replace(
            /\.[^.]+$/,
            `.${extension}`
        )

        return new File([blob], compressedName, {
            type: mimeType,
            lastModified: Date.now(),
        })
    }

    const uploadImage = async (file, folder = 'products') => {
        const compressedFile = await compressImage(file)
        const safeName = compressedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const imageRef = ref(
            storage,
            `${folder}/${Date.now()}-${safeName}`
        )

        await uploadBytes(imageRef, compressedFile, {
            contentType: compressedFile.type,
        })

        return getDownloadURL(imageRef)
    }

    const uploadProductImage = (file) => uploadImage(file, 'products')

    const deleteStorageImage = async (url) => {
        if (!url) {
            return
        }

        try {
            await deleteObject(ref(storage, url))
        } catch (err) {
            if (err?.code !== 'storage/object-not-found') {
                console.warn('Could not delete old image:', url, err)
            }
        }
    }

    const deleteStorageImages = async (urls) => {
        await Promise.all(
            [...new Set(urls.filter(Boolean))].map(deleteStorageImage)
        )
    }

    const resetForm = () => {
        setForm(emptyForm)
        setImageFile(null)
        setGalleryFiles([])
        setGalleryUrls([])
        setEditingId(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (
            form.type === 'card' &&
            !imageFile &&
            galleryFiles.length === 0 &&
            (!editingId || galleryUrls.length === 0)
        ) {
            showToast('Add a main image or at least one gallery image.', 'error')
            return
        }

        try {
            setLoading(true)
            const currentProduct = editingId
                ? products.find(product => product.id === editingId)
                : null

            const imageUrl = imageFile
                ? await uploadProductImage(imageFile)
                : ''

            const uploadedGallery = await Promise.all(
                galleryFiles.map(uploadProductImage)
            )

            const productData = {
                name: form.name,
                price: `\u20a6${form.price}`,
                description: form.description,
                category: form.category,
                featured: form.featured,
                available: form.available,
                sortOrder: form.sortOrder === ''
                    ? 0
                    : Number(form.sortOrder),
                type: form.type,
            }

            if (form.type === 'card') {
                const existingGallery = editingId
                    ? galleryUrls
                    : []
                const mainImage = imageUrl ||
                    existingGallery[0] ||
                    uploadedGallery[0] ||
                    ''
                const newGalleryImages = uploadedGallery.filter(
                    url => url !== mainImage
                )
                const gallery = uploadedGallery.length > 0
                    ? [mainImage, ...existingGallery.filter(url => url !== mainImage), ...newGalleryImages]
                    : imageUrl
                        ? [mainImage, ...existingGallery]
                        : editingId
                            ? existingGallery
                            : [mainImage]

                if (mainImage) {
                    productData.image = mainImage
                    productData.gallery = [...new Set(gallery.filter(Boolean))]
                }
            } else if (editingId) {
                productData.image = deleteField()
                productData.gallery = deleteField()
            }

            const nextImages = [
                productData.image,
                ...(Array.isArray(productData.gallery)
                    ? productData.gallery
                    : []),
            ].filter(Boolean)
            const oldImages = getProductImages(currentProduct)
            const imagesToDelete = oldImages.filter(
                url => !nextImages.includes(url)
            )

            if (editingId) {
                const productRef = doc(db, 'products', editingId)
                await updateDoc(productRef, productData)
            } else {
                await addDoc(collection(db, 'products'), productData)
            }

            await deleteStorageImages(imagesToDelete)
            localStorage.removeItem(PRODUCTS_CACHE_KEY)
            showToast(
                editingId
                    ? 'Product updated.'
                    : 'Product added.'
            )
            resetForm()
            fetchProducts()
        } catch (err) {
            console.error(err)
            showToast('Could not save this product.', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            setDeletingId(id)
            const product = products.find(item => item.id === id)

            await deleteDoc(doc(db, 'products', id))
            await deleteStorageImages(getProductImages(product))
            localStorage.removeItem(PRODUCTS_CACHE_KEY)
            showToast('Product deleted.')
            setConfirmDeleteProduct(null)
            fetchProducts()
        } catch (err) {
            console.error(err)
            showToast('Could not delete this product.', 'error')
        } finally {
            setDeletingId(null)
        }
    }

    const handleSiteImagesSubmit = async (e) => {
        e.preventDefault()

        if (!heroImageFile && !aboutImageFile) {
            showToast('Choose at least one image to update.', 'error')
            return
        }

        try {
            setSiteImagesLoading(true)

            const nextImages = { ...siteImages }
            const imagesToDelete = []

            if (heroImageFile) {
                nextImages.heroImage = await uploadImage(heroImageFile, 'site')
                imagesToDelete.push(siteImages.heroImage)
            }

            if (aboutImageFile) {
                nextImages.aboutImage = await uploadImage(aboutImageFile, 'site')
                imagesToDelete.push(siteImages.aboutImage)
            }

            await setDoc(
                doc(db, 'siteContent', 'homepage'),
                nextImages,
                { merge: true }
            )

            await deleteStorageImages(imagesToDelete)
            setSiteImages(nextImages)
            setHeroImageFile(null)
            setAboutImageFile(null)
            localStorage.removeItem(SITE_CONTENT_CACHE_KEY)
            showToast('Homepage images updated.')
        } catch (err) {
            console.error(err)
            showToast('Could not update homepage images.', 'error')
        } finally {
            setSiteImagesLoading(false)
        }
    }

    const handleEdit = (product) => {
        setForm({
            name: product.name || '',
            price: String(product.price || '').replace(/[^\d.]/g, ''),
            description: product.description || '',
            category: product.category || 'Small Chops',
            featured: product.featured || false,
            available: product.available !== false,
            sortOrder: product.sortOrder ?? '',
            type: product.type || 'card',
        })

        setImageFile(null)
        setGalleryFiles([])
        setGalleryUrls(getProductGallery(product))
        setEditingId(product.id)

        window.requestAnimationFrame(() => {
            productFormRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        })
    }

    return (
        <div className={styles.admin}>
            {toast && (
                <div
                    className={`${styles.toast} ${styles[toast.type]}`}
                    role="status"
                >
                    {toast.message}
                </div>
            )}

            <div className={styles.header}>
                <h1>MyPicks Admin</h1>

                <button
                    className={styles.logout}
                    onClick={() => signOut(auth)}
                >
                    Logout
                </button>
            </div>

            <form
                className={`${styles.form} ${styles.siteImagesForm}`}
                onSubmit={handleSiteImagesSubmit}
                aria-busy={siteImagesLoading}
            >
                <div className={styles.sectionHeader}>
                    <h2>Homepage Images</h2>
                    <p>
                        Images are compressed before upload. Replaced images are deleted from Firebase Storage.
                    </p>
                </div>

                <div className={styles.siteImageGrid}>
                    <div className={styles.siteImageField}>
                        <label>Hero image</label>

                        <div className={styles.siteImagePreview}>
                            <img
                                src={
                                    siteImages.heroImage ||
                                    `${import.meta.env.BASE_URL}hero.jpg`
                                }
                                alt="Current hero"
                            />
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setHeroImageFile(e.target.files?.[0] || null)
                            }
                        />
                    </div>

                    <div className={styles.siteImageField}>
                        <label>About image</label>

                        <div className={styles.siteImagePreview}>
                            <img
                                src={
                                    siteImages.aboutImage ||
                                    `${import.meta.env.BASE_URL}mypicks-food.jpg`
                                }
                                alt="Current about"
                            />
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setAboutImageFile(e.target.files?.[0] || null)
                            }
                        />
                    </div>
                </div>

                <button disabled={siteImagesLoading}>
                    {siteImagesLoading ? (
                        <LoadingLabel text="Saving images..." />
                    ) : (
                        'Save Homepage Images'
                    )}
                </button>
            </form>

            <form
                onSubmit={handleSubmit}
                className={styles.form}
                aria-busy={loading}
                ref={productFormRef}
            >
                <div className={styles.sectionHeader}>
                    <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
                    <p>
                        Product changes save to Firebase and refresh the public menu.
                    </p>
                </div>

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

                <input
                    type="number"
                    name="sortOrder"
                    placeholder="Display order, e.g. 1"
                    value={form.sortOrder}
                    onChange={handleChange}
                    min="0"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
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

                <div className={styles.field}>
                    <label>Product Type</label>

                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                    >
                        <option value="card">
                            Card Product
                        </option>

                        <option value="simple">
                            Simple Menu Item
                        </option>
                    </select>
                </div>

                {form.type === 'card' && (
                    <>
                        <div className={styles.field}>
                            <label>Main card image</label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Gallery images</label>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryChange}
                            />

                            <p className={styles.helpText}>
                                Images are compressed before upload. Removed or replaced images are deleted from Firebase Storage.
                            </p>
                        </div>

                        {galleryUrls.length > 0 && (
                            <div className={styles.galleryEditor}>
                                <p className={styles.galleryTitle}>
                                    Saved gallery
                                </p>

                                <div className={styles.galleryList}>
                                    {galleryUrls.map((url, index) => (
                                        <div
                                            className={styles.galleryItem}
                                            key={url}
                                        >
                                            <img src={url} alt="" />

                                            {index === 0 && (
                                                <span className={styles.mainBadge}>
                                                    Main
                                                </span>
                                            )}

                                            <div className={styles.galleryActions}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleMoveGalleryImage(index, -1)}
                                                    disabled={index === 0}
                                                >
                                                    Up
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleMoveGalleryImage(index, 1)}
                                                    disabled={index === galleryUrls.length - 1}
                                                >
                                                    Down
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveGalleryImage(url)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        name="featured"
                        checked={form.featured}
                        onChange={(e) =>
                            setForm({ ...form, featured: e.target.checked })
                        }
                    />
                    Mark as Featured (Chef's Pick)
                </label>

                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        name="available"
                        checked={form.available}
                        onChange={(e) =>
                            setForm({ ...form, available: e.target.checked })
                        }
                    />
                    Show this product on the website
                </label>

                <div className={styles.formActions}>
                    <button disabled={loading}>
                        {loading ? (
                            <LoadingLabel
                                text={
                                    editingId
                                        ? 'Updating product...'
                                        : 'Adding product...'
                                }
                            />
                        ) : (
                            editingId ? 'Update Product' : 'Add Product'
                        )}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={resetForm}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className={styles.listTools}>
                <div className={styles.sectionHeader}>
                    <h2>Products</h2>
                    <p>
                        Search, filter, edit, hide, reorder, or delete menu items.
                    </p>
                </div>

                <div className={styles.filters}>
                    <input
                        type="search"
                        placeholder="Search products"
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                    />

                    <select
                        value={adminStatusFilter}
                        onChange={(e) => setAdminStatusFilter(e.target.value)}
                    >
                        <option value="all">All products</option>
                        <option value="available">Visible only</option>
                        <option value="hidden">Hidden only</option>
                    </select>
                </div>
            </div>

            <div className={styles.list}>
                {visibleProducts.map((product) => (
                    <div key={product.id} className={styles.card}>
                        {product.image ? (
                            <img src={product.image} alt={product.name} />
                        ) : (
                            <div className={styles.placeholderImage}>
                                No image
                            </div>
                        )}

                        <div className={styles.info}>
                            <h3>
                                {product.name}
                            </h3>

                            <div className={styles.badges}>
                                {product.featured && (
                                    <span className={styles.badge}>
                                        Featured
                                    </span>
                                )}

                                <span
                                    className={
                                        product.available === false
                                            ? styles.hiddenBadge
                                            : styles.visibleBadge
                                    }
                                >
                                    {product.available === false
                                        ? 'Hidden'
                                        : 'Visible'}
                                </span>
                            </div>

                            <p className={styles.typeBadge}>
                                {product.type === 'simple'
                                    ? 'Simple Item'
                                    : 'Card Product'}
                            </p>

                            <p className={styles.typeBadge}>
                                Order: {product.sortOrder ?? 0}
                            </p>

                            {product.type === 'card' && (
                                <p className={styles.typeBadge}>
                                    {product.gallery?.length || 0} gallery images
                                </p>
                            )}

                            <p>{product.price}</p>
                        </div>

                        <div className={styles.actions}>
                            <button
                                onClick={() => handleEdit(product)}
                                disabled={loading || deletingId === product.id}
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => setConfirmDeleteProduct(product)}
                                disabled={deletingId === product.id}
                            >
                                {deletingId === product.id ? (
                                    <LoadingLabel text="Deleting..." />
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                ))}

                {visibleProducts.length === 0 && (
                    <p className={styles.emptyList}>
                        No products match this filter.
                    </p>
                )}
            </div>

            {confirmDeleteProduct && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} role="dialog" aria-modal="true">
                        <h2>Delete product?</h2>
                        <p>
                            This will remove "{confirmDeleteProduct.name}" and delete
                            its saved Firebase Storage images.
                        </p>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={() => setConfirmDeleteProduct(null)}
                                disabled={deletingId === confirmDeleteProduct.id}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={styles.dangerButton}
                                onClick={() => handleDelete(confirmDeleteProduct.id)}
                                disabled={deletingId === confirmDeleteProduct.id}
                            >
                                {deletingId === confirmDeleteProduct.id ? (
                                    <LoadingLabel text="Deleting..." />
                                ) : (
                                    'Delete product'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Admin
