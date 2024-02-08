import { useContext } from 'react';
import { CountriesContext } from '../context/countries-context';

export const useCountryByOfficialName = (name?: string) => {
    const countries = useContext(CountriesContext)
    if (!countries?.length || !name) {
        return null
    }
    const sanitizedInputName = name.replace(/\s/g, '');
    return countries.find(country => country.name.official.replace(/\s/g, '') === sanitizedInputName)
}