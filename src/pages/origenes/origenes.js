import React, {useState, useEffect} from 'react'

import { getAllOrigenes } from 'network/lib/origenes'
import OrigenCard from 'components/cards/OrigenCard'

import { Paginator } from 'primereact/paginator';
import Search from 'components/Search'

export default function Origenes(){

  const [origenes, setOrigenes] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState({
    pageSize: 5,
    startIndex: 0,
    searchString: ""
  })

  useEffect(() => {
    getAllOrigenes(filters).then(res => {
      setOrigenes(res.data.results)
      setTotalCount(res.data["totalCount"])
    })
  }, [filters])

  const handlePageClick = (event) => {
    setFilters({
      ...filters,
      startIndex: event.first,
      pageSize: event.rows
    })
  }

  const changeSearchString = (newSearchString) => {
    setFilters({
      ...filters,
      searchString: newSearchString
    })
  }

  return(<>
    <h1>Origenes 📌</h1>
    <div className="flex flex-column">
      <div className="flex justify-content-center">
        <Search value={filters["searchString"]} onChange={changeSearchString} name="texto" placeholder="Buscar"/>
      </div>
      <div className='grid flex gap-3 justify-content-center'>
        {origenes.map(origen => <OrigenCard id={origen.id} key={origen.id} origen={origen}/>)}        
      </div>
      <div className='flex justify-content-center'>
        <Paginator first={filters["startIndex"]} rows={filters["pageSize"]} totalRecords={totalCount} rowsPerPageOptions={[2,3,5]} onPageChange={handlePageClick}></Paginator>
      </div>
    </div>    
    </>)
}