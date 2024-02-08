export const getClassName = (cellId: string) => {
    return cellId === 'flag' ? 'flag' : cellId === 'Country' ? 'country' : cellId === 'population' ? 'population' : '';
}