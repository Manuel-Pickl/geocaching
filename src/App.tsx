import './App.css'
import Map from './Map/Map'

const mapCenter: [number, number] = [51.505, -0.09];
const mapZoom: number = 13;

function App() {
  return (
    <>
      <Map center={mapCenter} zoom={mapZoom} />
    </>
  )
}

export default App
