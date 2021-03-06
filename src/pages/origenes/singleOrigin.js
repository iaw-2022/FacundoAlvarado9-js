import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { getVariedadesFromOrigen } from "network/lib/variedades"
import { getSingleOrigin } from 'network/lib/origenes'

import { Button } from 'primereact/button'

import Search from 'components/Search'
import TostaduriaDropdown from 'components/TostaduriasDropdown'
import VariedadGrid from 'components/VariedadGrid'
import Error from 'components/Error'
import TiposDropdown from 'components/TiposDropdown'
import OrigenMap from 'components/OrigenMap'

export default function SingleOrigin() {
  
  const [origen, setOrigen] = useState({})
  const [variedades, setVariedades] = useState([])

  const [totalCount, setTotalCount] = useState(0)

  const [filters, setFilters] = useState({
    pageSize: 5,
    startIndex: 0,
    searchString: "",    
    tostaduria: null,
    tipo: null
  })

  const [errored, setErrored] = useState(false)
  const [loadingOrigenInfo, setLoadingOrigenInfo] = useState(true)
  const [loadingVariedades, setLoadingVariedades] = useState(true)

  const { origen_id }= useParams()

  useEffect(() => {
    setLoadingOrigenInfo(true)

    getSingleOrigin(origen_id).then(res => {
      setOrigen(res.data["results"][0])
      setLoadingOrigenInfo(false)
    }).catch((error) => {
      setErrored(true)
      setLoadingOrigenInfo(false)
    })
  }, [origen_id])

  useEffect(() => {
    setLoadingVariedades(true)

    getVariedadesFromOrigen(origen_id, filters).then(resVariedades => {
      setVariedades(resVariedades.data["results"])
      setTotalCount(resVariedades.data["totalCount"])
      setLoadingVariedades(false)
    }).catch((error) => {
      setErrored(true)
      setLoadingVariedades(false)
    })
  }, [origen_id, filters])

  const handlePageClick = (event) => {
    setFilters({
      ...filters,
      startIndex: event.first,
      pageSize: event.rows
    })
  }

  const changeSearchString = (newSearchString) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      searchString: newSearchString
    }))
  }

  const changeTostaduriaFilter = (newTostaduria) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      tostaduria: newTostaduria
    }))
  }

  const changeTipoFilter = (newTipo) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      tipo: newTipo
    }))
  }

  const navigate = useNavigate()

  const showVariedades = <>
      <div className='flex flex-column'>    
        <div className='flex flex-column md:flex-row gap-0 md:gap-3 justify-content-center align-items-center'>
          <div className="flex link">
            <Button icon="pi pi-chevron-left" onClick={() => navigate(-1)} label="Volver"/>
          </div>
          <div className="flex">
            <Search value={filters["searchString"]} onChange={changeSearchString} name="texto" placeholder="Buscar"/>
          </div>
          <div className="flex">
            <TostaduriaDropdown onChange={changeTostaduriaFilter} />
          </div>
          <div className="flex">
            <TiposDropdown onChange={changeTipoFilter} />
          </div>
        </div>
          <VariedadGrid variedades={variedades} 
              titulo={ origen["nombre"] } 
              descripcion={origen["descripcion"]}
              startIndex={filters["startIndex"]}
              pageSize={filters["pageSize"]}
              totalCount={totalCount}
              onPageChange={handlePageClick}
              loadingTitle={loadingOrigenInfo}
              loadingVariedades={loadingVariedades}
              />
          <div className="flex justify-content-center m-5">
            <OrigenMap origen={origen} loading={loadingOrigenInfo}/>
          </div>          
      </div> 
    </>
    
  let result;
  if(!errored){
    result = showVariedades        
  } else{
    result = <Error volver="/origenes"/>
  }

  return(    
    result
  )
}