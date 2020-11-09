import { useState, useCallback } from 'react'

const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const request = useCallback(async (url = '', method = 'GET', body = null, headers = {}) => {
        setIsLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            const response = await fetch(url, {
                method,
                body,
                headers
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.msg || 'Couldn\'t get data from server')
            }

            setIsLoading(false)

            return data
        } catch(err) {
            setIsLoading(false)
            setError(err.message)
            throw err
        }
    }, [])

    const clearError = useCallback(() => setError(null), [])
    return { request, isLoading, error, clearError }
}

export { useFetch }
