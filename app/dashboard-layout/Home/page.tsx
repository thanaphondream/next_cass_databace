"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LeafletMap from "../LeafletMap/page";

interface MeteorologicalData {
  id: number;
  year: number;
  month: number;
  day: number;
  hours: number;
  temperaturde: number;
  humidity: number;
  slp: number;
  rain: number;
  windspeed10m: number;
  winddirdedtion10m: number;
  lowcloud: number;
  highcloud: number;
  date: string;
}

interface LocationData {
  id: number;
  name_location: string;
  latitude: number;
  longitude: number;
  date: string;
  meteorological_id: MeteorologicalData[];
}

interface LatestLocation {
  name: string;
  latitude: number;
  longitude: number;
  latestData: MeteorologicalData;
}

export default function HomePage() {
  const router = useRouter();
  const [locationdata, setLocationdata] = useState<LocationData[]>([]);
  const [latestLocations, setLatestLocations] = useState<LatestLocation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rsdata = await fetch("http://10.90.1.118:3001/api/locationget");
        const jsondata: LocationData[] = await rsdata.json();
        setLocationdata(jsondata);

        const withLatest: LatestLocation[] = jsondata
          .map((loc) => {
            const latest = [...loc.meteorological_id].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];

            return {
              name: loc.name_location,
              latitude: loc.latitude,
              longitude: loc.longitude,
              latestData: latest,
            };
          })
          .filter((loc) => loc.latestData)
          .sort(
            (a, b) =>
              new Date(b.latestData.date).getTime() - new Date(a.latestData.date).getTime()
          )
          .slice(0, 4);

        setLatestLocations(withLatest);
      } catch (err) {
        console.error("Error fetching location data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        หน้าหลัก
      </h1>

      {/* แผนที่ */}
      <LeafletMap locationdata={locationdata} />


      {/* แสดง 4 Location ล่าสุด แนวนอน */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          📌 4 สถานที่ที่มีข้อมูลล่าสุด
        </h2>

        <div className="flex overflow-x-auto gap-4 pb-2">
          {latestLocations.map((loc, idx) => (
            <div
              key={idx}
              className="min-w-[260px] bg-gradient-to-r bg-gray-50 p-4 rounded-xl shadow-md border border-b-amber-950"
            >
              <h3 className="font-bold text-xl text-blue-800 mb-2">
                📍 {loc.name}
              </h3>
              <p className="text-sm text-gray-600">
                🕒 {new Date(loc.latestData.date).toLocaleString()}
              </p>
              <div className="mt-2 text-sm">
                <p>🌡️ อุณหภูมิ: {loc.latestData.temperaturde} °C</p>
                <p>💧 ความชื้น: {loc.latestData.humidity} %</p>
                <p>🌧️ ฝน: {loc.latestData.rain} mm</p>
                <p>💨 ลม: {loc.latestData.windspeed10m} m/s</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
