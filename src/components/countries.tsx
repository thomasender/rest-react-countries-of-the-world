import { useContext, useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
// import { useCountries } from '../hooks/use-countries'
import { useTable, usePagination, useSortBy } from 'react-table';
import Button from 'react-bootstrap/Button'
import { ICountry } from '../types/country';
import { TableInstanceWithPagination } from '../types/react-table';
import { getClassName } from './utils';
import { CountriesContext } from '../context/countries-context';

export const Countries = () => {
    const countries = useContext(CountriesContext)

    const [searchTerm, setSearchTerm] = useState('')

    const filteredCountries = useMemo(() => {
      if (searchTerm === '') {
        return countries
      }
      return countries?.filter(country => country.name.common.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [countries, searchTerm])
  
    const columns = useMemo(
        () => [
            {
                Header: 'Flag',
                accessor: 'flag' as keyof ICountry,
            },
            {
                Header: 'Country',
                accessor: (row: ICountry) => row.name.official,
            },
            {
                Header: 'Population',
                accessor: 'population' as keyof ICountry,
            }
        ],
        []
    )
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
        // @ts-expect-error: not yet figured out how to type this correctly
    } = useTable({ columns, data: filteredCountries }, useSortBy, usePagination) as TableInstanceWithPagination<ICountry>;

    if(countries?.length === 0) {
        return <div>Loading</div>
    }

  return (
    <>
      <input
          className="search-box"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          placeholder="Search countries"
        />
      <table className="table table-hover" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                  // @ts-expect-error: not yet figured out how to type this correctly
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {/* @ts-expect-error: not yet figured out how to type this correctly */}
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                  {row.cells.map(cell => { 
                      const className = getClassName(cell.column.id)
                      return (
                          <td className={className} {...cell.getCellProps()}>
                            <Link to={`/country/${row.original.name.official.replace(/\s/g, '')}`}>
                              {cell.render('Cell')}
                            </Link>
                          </td>
                      );
                  })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <Button variant='info' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </Button>{' '}
        <Button variant='info' onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </Button>{' '}
        <Button variant='info' onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </Button>{' '}
        <Button variant='info' onClick={() => gotoPage(pageCount -  1)} disabled={!canNextPage}>
          {'>>'}
        </Button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex +  1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex +  1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) -  1 :  0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10,  20,  30,  40,  50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}