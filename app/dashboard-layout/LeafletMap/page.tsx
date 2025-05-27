"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import React, { FC, useState, useEffect } from "react";

interface Meteorological {
  id: number;
  date: string;
  rain: number;
  temperaturde: number;
  humidity: number;
  [key: string]: any;
}

interface LocationData {
  id: number;
  name_location: string;
  latitude: number;
  longitude: number;
  meteorological_id: Meteorological[];
}

interface Props {
  locationdata: LocationData[];
}

const getRainColor = (rain: number) => {
  if (rain === 0) return "#28a745"; // เขียว
  if (rain <= 5) return "#ffc107"; // เหลือง
  return "#dc3545"; // แดง
};

const LeafletMap: FC<Props> = ({ locationdata }) => {
  const [markers, setMarkers] = useState<
    {
      position: LatLngTuple;
      name: string;
      rain: number;
      latestData?: Meteorological;
    }[]
  >([]);

  const initialPosition: LatLngTuple = [13.736717, 100.523186];
  const initialZoom = 6;

  useEffect(() => {
    if (locationdata && locationdata.length > 0) {
      const processed = locationdata.map((item) => {
        const latest = [...item.meteorological_id].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        return {
          position: [item.latitude, item.longitude] as LatLngTuple,
          name: item.name_location,
          rain: latest?.rain || 0,
          latestData: latest,
        };
      });
      setMarkers(processed);
    }
  }, [locationdata]);

  return (
    <div style={{ height: "80vh", width: "58vw" }}>
      <MapContainer
        center={initialPosition}
        zoom={initialZoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker, idx) => (
          <CircleMarker
            key={idx}
            center={marker.position}
            radius={10} 
            color={getRainColor(marker.rain)}
            fillColor={getRainColor(marker.rain)}
            fillOpacity={0.7}
            stroke={true}
          >
            <Popup>
              <strong>{marker.name}</strong><br />
              ปริมาณฝนล่าสุด: {marker.rain} มม.<br />
              อุณหภูมิ: {marker.latestData?.temperaturde}°C<br />
              ความชื้น: {marker.latestData?.humidity}%
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
