import './App.css'
import Map from './Map/Map'

const mapCenter: [number, number] = [51.505, -0.09];

function App() {
  return (
    <>
      <Map position={mapCenter} />
    </>
  )
}

export default App