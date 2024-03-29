/* global fetch, L */
import React, { useEffect, useRef, useState } from 'react'
import Moment from 'moment'
// Require lodash for quick object manipulation
import _ from 'lodash'
import moment from 'moment';


const getRouteSummary = (location) => {
  
  const first = Moment(location[0].time).format('YYYY-MM-DD hh:mm');
  const secnd  = Moment(location[location.length - 1 ].time).format('YYYY-MM-DD hh:mm');
  
  const from = first > secnd ? secnd : first;
  const to = first > secnd ? first : secnd;
  // const to = Moment(locations[0].time).format('hh:mm DD.MM')
  // const from = Moment(locations[locations.length - 1].time).format('hh:mm DD.MM')
  return `${from} - ${to}`
}

const MapComponent = ({loc}) => {
  const map = useRef()
  const [locations, setLocations] = useState()
  const [marker, setmarker] = useState();

  // Request location data.
  useEffect(() => {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then((json) => {
        setLocations(json)
      })
  }, [])
  // TODO(Task 2): Request location closest to specified datetime from the back-end.

  
  // Initialize map.
  useEffect(() => {
    map.current = new L.Map('mapid')
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    const osm = new L.TileLayer(osmUrl, {
      minZoom: 8,
      maxZoom: 12,
      attribution
    })
    map.current.setView(new L.LatLng(52.51, 13.40), 9)
    map.current.addLayer(osm)
  }, [])
  // Update location data on map.
  useEffect(() => {
    if (!map.current || !locations) {
      return // If map or locations not loaded yet.
    }


    // TODO(Task 1): Replace the single red polyline by the different segments on the map.
    // Get the location key -> the Days
    const locationKeys = _.keys(locations);
    // Each color corrspond to a day
    const colors = ['black', 'blue', 'red', 'green', 'yellow', 'orange', 'cadetblue', 'cyan'];

    // Loop through the locations and display them in the map
    for (let index = 0; index < _.size(locations); index++) {
      const key = locationKeys[index];
      
      const latlons = locations[key].map(({ lat, lon }) => [lat, lon])
      const polyline = L.polyline(latlons, { color: colors[index] })
            .bindPopup(getRouteSummary(locations[key]))
            .addTo(map.current)
      
      map.current.fitBounds(polyline.getBounds())
      // return () => map.current.remove(polyline)
    }
    
  }, [locations, map.current])

  // TODO(Task 2): Display location that the back-end returned on the map as a marker.
  useEffect(() => {
  
    // Remove the marker if was set to avoid multi marker on the map
    if(marker !== undefined) {
      map.current.removeLayer(marker);
    }

    // If location selected from the props, then mark in the map
    if(loc){
      let theMarker = L.marker([loc.lat, loc.lon], {title: moment(loc.time).format('YYYY-MM-DD hh:mm')})
                      .addTo(map.current);
      setmarker(theMarker)
    }

  }, [loc])
  return (
    <div>
      {locations && `${_.size(locations)} locations loaded`}
      {!locations && 'Loading...'}
      <div id='mapid' />
      
    </div>)
}

export default MapComponent
