import React, { useEffect } from 'react'
import { withRouter } from 'react-router'
import { useForm } from 'react-hook-form'
import isEmpty from 'lodash/isEmpty'

import { writeItem } from '../../utils/storeOps'
import { useFetch } from '../../utils/customHooks/useFetch'
import { useToastNotif } from '../../utils/customHooks/useToastNotif'
import './Signup.scss'

const setToken = (name, value) => writeItem(name, value)

const ERRORS_TYPE = Object.freeze({
    'required': 'password is required',
    'minLength': 'Min length at least 9 characters',
    'pattern': 'Password should contains at least 1 digit, 1 uppercase letter, min length 8'
})

const passPatern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

const SignupComp = props => {
    console.log('RENDER...')
    const { isLoading, request, error, clearError } = useFetch()
    const message = useToastNotif()
    const { register, handleSubmit, errors } = useForm()

    useEffect(() => {
        console.log('USE EFFECT...', error, clearError, message)
        message(error)
        clearError()
    }, [error, clearError, message])

    const signup = async data => {
        const user = {
            email: data.email,
            password: data.password,
        }

        try {
            const data = await request('/api/user/signup', 'POST', { ...user })
            setToken('token', data.token)
            props.history.push('/')
            Promise.resolve().then(() => {
                window.location.reload()
            })
        } catch (err) {}
    }

    return (
        <div className="signupPage">
            <form action="" className="form" onSubmit={handleSubmit(signup)}>
                <input
                    name="email"
                    type="email"
                    ref={register({ required: true })}
                />
                {errors.email && 'email is required.'}
                <input
                    name="password"
                    type="password"
                    ref={register({ required: true, minLength: 9, pattern: passPatern })}
                />
                {errors.password && ERRORS_TYPE[errors.password.type]}
                <button type="submit" disabled={isLoading || !isEmpty(errors)}>Sign up</button>
            </form>
        </div>
    )
}

const Signup = withRouter(SignupComp)

export { Signup }
