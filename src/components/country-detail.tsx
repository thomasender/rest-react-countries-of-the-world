import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { useCountryByOfficialName } from '../hooks/use-country-by-official-name';
import mapboxgl from 'mapbox-gl';
import { MAP_BOX_ACCESS_TOKEN } from '../constants';
import { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import { Helmet } from 'react-helmet'

// Move this to env var for deployments!
mapboxgl.accessToken = MAP_BOX_ACCESS_TOKEN;

export const CountryDetail = () => {
    const { name: officialName } = useParams<{ name: string}>();
    const country = useCountryByOfficialName(officialName)
    const mapContainer = useRef(null);

    useEffect(() => {
        if(!country || !mapContainer.current) {
            return
        }
    const [lat, lng] = country.latlng;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Replace with the style URL you prefer
      center: [lng, lat],
      zoom: 1,
      dragPan: true, // Disable panning by dragging
      scrollZoom: true, // Disable zooming by scrolling
      touchZoomRotate: true, // Disable zooming and rotation by touch
      doubleClickZoom: true, // Disable zooming by double clicking
      boxZoom: false, // Disable zooming by drawing a box
      dragRotate: false, // Disable rotation by dragging
      keyboard: false, // Disable keyboard shortcuts
      attributionControl: false // Hide the attribution control
    });

    // Cleanup on unmount
    return () => map.remove();
  }, [country]); // Empty array ensures effect runs only once
  
    if(!country) {
        return <div>Loading</div>
    }

    const { name, population, area, region, subregion, capital, flags, independent, status, unMember, currencies, languages  } = country;
  return (
    <>
      <Helmet>
        <title>{name.common}</title>
      </Helmet>
      <Card className="d-flex flex-column align-items-center justify-content-center gap-2 p-4">
          <h1>{name.common}</h1>
          {/* @ts-expect-error: not yet figured out how to type this correctly */}
          <Button variant="primary" as={Link} to="/">Back</Button>
          <CardBody>
          <div>
              <img className="detail-flag" src={flags.png} alt={name.official} />
          </div>
          <div className="country-info">
              <p>Population: {population.toLocaleString()}</p>
              <p>Capital: {capital}</p>
              <p>Currencies: {Object.values(currencies).map(currency => currency.name).join(', ')}</p>
              <p>Area: {area.toLocaleString()} km²</p>
              <p>Languages: {Object.values(languages).join(', ')}</p>
              <p>Region: {region}</p>
              <p>Subregion: {subregion}</p>
              <p>Independent: {independent ? 'Yes' : 'No'}</p>
              <p>Status: {status}</p>
              <p>UN Member: {unMember ? 'Yes' : 'No'}</p>
          </div>
          </CardBody>
          <div ref={mapContainer} className="map container"></div>
      </Card>
    </>
  )
}
