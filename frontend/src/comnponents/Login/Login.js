import React, { useEffect } from 'react'
import { useHistory } from 'react-router'

import { writeItem } from '../../utils/storeOps'
import { useFetch } from '../../utils/customHooks/useFetch'
import { useToastNotif } from '../../utils/customHooks/useToastNotif'
import './Login.scss'
import { useForm } from 'react-hook-form'

const setToken = (name, value) => writeItem(name, value)
const setUserId = (name, value) => writeItem(name, value)

const Login = () => {
    const { register, handleSubmit, errors } = useForm()

    const { isLoading, request, error, clearError } = useFetch()
    const message = useToastNotif()
    const history = useHistory()

    useEffect(() => {
        message(error)
        clearError()
    }, [message, error, clearError])

    const login = async data => {
        const user = {
            email: data.email,
            password: data.password,
        }

        try {
            const data = await request('/api/user/login', 'POST', { ...user })
            setToken('token', data.token)
            setUserId('userId', data.userId)
            history.push('/')
            Promise.resolve().then(() => {
                window.location.reload()
            })
        } catch (err) {}
    }

    return (
        <div className="signupPage">
            <form action="" className="form" onSubmit={handleSubmit(login)}>
                <input
                    name="email"
                    type="email"
                    ref={register({ required: true })}
                />
                {errors.email && 'email is required.'}
                <input
                    name="password"
                    type="password"
                    ref={register({ required: true })}
                />
                {errors.password && 'password is required.'}
                <button type="submit" disabled={isLoading}>Login</button>
            </form>
        </div>
    )
}

export { Login }
