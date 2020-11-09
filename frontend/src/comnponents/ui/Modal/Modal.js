import React from 'react'

import styles from './Modal.module.scss'

const Modal = ({ children, onClose }) => (
    <div className={styles.wrp}>
        <button className={styles.closeBtn} onClick={onClose}>x</button>
        <div>
            {children}
        </div>
    </div>
)

export { Modal }
