import React from 'react'
import {Link} from 'react-router-dom'
import { Card } from 'primereact/card'

class TostaduriaCard extends React.Component {

    render(){
        const header = <Link to={"" + this.props.id }><h2>{ this.props.nombre }</h2></Link>
        return(<>                
            <Card className="col-3" title={header}>                            
            </Card>                
        </>)
    }
}

export default TostaduriaCard
