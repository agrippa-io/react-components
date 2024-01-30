import React from 'react'

import { Box } from '@mui/material'
import GoogleMapReact from 'google-map-react'
import { IMapGoogleProps } from './@types'
import { MapGoogleConfigTable } from './components/MapGoogleConfigTable'

interface IMarkerSimple {
  lat: number
  lng: number
  text: string
}
const MarkerSimple = ({ lat, lng, text }: IMarkerSimple) => (
  <div>
    {text} (lat: {lat}, lng: {lng})
  </div>
)
const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: 11,
}

export function MapGoogle({ config, debug = false }: IMapGoogleProps) {
  console.log('CONFIG', config)
  return (
    <>
      <Box height={600} width="100%">
        <GoogleMapReact
          bootstrapURLKeys={{ key: config.apiKey }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <MarkerSimple lat={59.955413} lng={30.337844} text="My Marker" />
        </GoogleMapReact>
      </Box>
      <MapGoogleConfigTable config={config} debug={debug} />
    </>
  )
}
