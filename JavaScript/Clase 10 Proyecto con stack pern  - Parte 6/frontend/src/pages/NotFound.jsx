import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../componentes'

function NotFound() {
    return(
        <div className='h[clac(100hv-64px)] flex justify-center items-center flex-col'>
            <Card>
                <h1 className="text-4x1 font-bold my-2 text-center">404</h1>
                <h3 className='text-x1 text-center'>Pagina no encontrada</h3>
                <Link to='/' className='text-blue-500:underline'>Volver al inicio</Link>
            </Card>
        </div>
    )
}

export default NotFound