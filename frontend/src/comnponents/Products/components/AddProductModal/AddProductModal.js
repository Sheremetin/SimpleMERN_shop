import React, { useContext } from 'react'
import { Modal } from '../../../ui/Modal'
import { useInput } from '../../../../utils/customHooks/useInput'
import { ShopContext } from '../../../../context/context'
import './AddProductModal.scss'

const AddProductModal = ({ showModal }) => {
    const inputProdName = useInput('')
    const inputProdPrice = useInput('')
    const inputProdDesc = useInput('')
    const { addProduct } = useContext(ShopContext)


    const addNewProduct = e => {
        e.preventDefault()
        const product = {
            name: inputProdName.value,
            price: inputProdPrice.value,
            desc: inputProdDesc.value
        }
        addProduct(product)
        showModal()
    }

    return (
        <Modal onClose={showModal}>
            <form action="" className="form" onSubmit={addNewProduct}>
                <input type="text" value={inputProdName.value} onChange={inputProdName.onChange}/>
                <input type="number" value={inputProdPrice.value} onChange={inputProdPrice.onChange}/>
                <textarea value={inputProdDesc.value} onChange={inputProdDesc.onChange}/>
                <button type="submit">Create product</button>
            </form>
        </Modal>
    )
}
export { AddProductModal }
