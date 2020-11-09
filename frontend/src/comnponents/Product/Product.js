import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useFetch } from '../../utils/customHooks/useFetch'
import { useToastNotif } from '../../utils/customHooks/useToastNotif'
import styles from './Product.module.scss'

const Product = () => {
    const productId = useParams().id
    const message = useToastNotif()
    const history = useHistory()
    const [product, setProduct] = useState({})
    const { request, error } = useFetch()

    useEffect(() => {
        message(error)
    }, [message, error])

    const getProductData = async () => {
        try {
            const data = await request(`/api/products/${productId}`)
            setProduct(data)
        } catch (err) {
        }
    }

    useEffect(() => {
        getProductData()
        // eslint-disable-next-line
    }, [])

    const stepBack = () => {
        history.goBack()
    }

    return (
        <div className="wrp">
            <div className={styles.productTile}>
                <button onClick={stepBack} className={styles.backBtn}>&#x2B05; Back</button>
                <h2>Product details:</h2>
                <h3><b>{product.name}</b> - ${product.price}</h3>
                <p>{product.desc}</p>
            </div>
        </div>
    )
}

export { Product }
