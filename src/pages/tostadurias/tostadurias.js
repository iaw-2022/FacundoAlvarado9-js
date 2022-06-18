import React, {useState, useEffect} from 'react'

import { getAllTostadurias } from "network/lib/tostadurias"
import TostaduriaCard from 'components/cards/TostaduriaCard'
import { Paginator } from 'primereact/paginator'
import Search from 'components/Search'

export default function Tostadurias(){
  const [tostadurias, setTostadurias] = useState([])

  const [totalCount, setTotalCount] = useState(0)

  const [filters, setFilters] = useState({
    errored: false,
    pageSize: 5,
    startIndex: 0,
    searchString: "",
  })

  useEffect(() => {
    getAllTostadurias(filters).then(res => {
      setTostadurias(res.data.results)
      setTotalCount(res.data["totalCount"])
    }).catch((error) => {
      this.setState({errored: true})
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
        
    <h1>Tostadurias 🏪</h1>
    <div className="flex flex-column">
      <div className="flex justify-content-center">
        <Search value={filters["searchString"]} onChange={changeSearchString} name="texto" placeholder="Buscar"/>
      </div>
      <div className='flex flex-column grid gap-3 justify-content-center'> 
        {tostadurias.map(tostaduria => <TostaduriaCard id={tostaduria.id} key={tostaduria.id} nombre={tostaduria.nombre}/>)}        
      </div>
      <div className="flex justify-content-center">
        <Paginator first={filters["startIndex"]} rows={filters["pageSize"]} totalRecords={totalCount} rowsPerPageOptions={[2,3,5]} onPageChange={handlePageClick}></Paginator>
      </div>
    </div>
    
    </>)
}