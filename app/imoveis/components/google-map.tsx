"use client"

import {
  APIProvider,
  Map
} from "@vis.gl/react-google-maps"
import { useState } from "react"

const GoogleMap = () => {
  const [open, setOpen] = useState(false)
  /* zoom: 12 */

  const position = {
    lat: -29.6846,
    lng: -51.1000
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>
      <Map
        zoom={12}
        center={position}
      >

      </Map>
    </APIProvider>
  )
}

export default GoogleMap