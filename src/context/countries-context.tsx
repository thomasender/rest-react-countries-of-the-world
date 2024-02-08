import { ReactNode, createContext, useEffect, useState } from 'react'
import { ICountry } from '../types/country'
import axios from 'axios'
import { COUNTRIES_LOCAL_STORAGE_KEY } from '../constants'

export const CountriesContext = createContext<ICountry[] | null>([])

export const CountriesProvider = ({children}: {children: ReactNode}) => {
    const [countries, setCountries] = useState<ICountry[]>([])
    const countriesFromLocalStorage = localStorage.getItem(COUNTRIES_LOCAL_STORAGE_KEY)

    useEffect(() => {
        if(countriesFromLocalStorage) {
            setCountries(JSON.parse(countriesFromLocalStorage))
        } else {
            try {
                axios.get('https://restcountries.com/v3.1/all')
                .then(response => {
                    setCountries(response.data)
                    localStorage.setItem(COUNTRIES_LOCAL_STORAGE_KEY, JSON.stringify(response.data))
                })
            } catch (error) {
                console.error(error)
            }
        }
    }, [countriesFromLocalStorage])

    if(!countries) {
        return <div>Loading</div>
    }

    return (
        <CountriesContext.Provider value={countries}>
            {children}
        </CountriesContext.Provider>
    )
}