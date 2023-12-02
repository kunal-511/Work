import { Navbar } from './Row'
import Title from './Title'
import Row from './Row'

import './App.css'

function App() {


  return (
    <>
      <Navbar />
      <Title />
      <Row />

      {/* const Navbar = () => {
    return (
        <>
            <nav className='navbar'>
                <div>logo</div>
                <div>
                    <input type="text" placeholder='search' />
                </div>
            </nav>
        </>
    )
}
export { Navbar }; */}

    </>
  )
}

export default App
