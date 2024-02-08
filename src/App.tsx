import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Countries } from "./components/countries"
import { CountryDetail } from './components/country-detail';
import {  CountriesProvider } from './context/countries-context';

function App() {
  return (
    <CountriesProvider>
      <Router>
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center">
          <h1>Countries of the world </h1>
          <Routes>
            <Route path="/country/:name" Component={CountryDetail} />
            <Route path="/" Component={Countries} />
          </Routes>
        </div>
      </Router>
    </CountriesProvider>
  )
}

export default App
