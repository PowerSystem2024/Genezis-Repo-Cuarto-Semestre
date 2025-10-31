import { useContext } from 'react'
import { Authcontext } from '../context/AuthContext'


function HomePage() {
  const data = useContext(Authcontext);
  console.log(data);
  return (
    <div>HomePage</div>
  )
}

export default HomePage