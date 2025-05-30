"use client";
import React, { useState, useEffect } from "react";

// (Interface definitions remain the same as before)
interface YearMonth {
  ges_year: number;
  ges_month: number;
}

interface So2Data {
  id: number;
  so2_name: string;
  so2: number;
  aod: number;
  o3: number;
  flag: number;
}

interface GesId {
  id: number;
  year: number;
  month: number;
  day: number;
  hours: number;
  so2_id: So2Data[];
}

interface LocationData {
  id: number;
  name_location: string;
  latitude: number;
  longitude: number;
  date: string;
  ges_id: GesId[];
}


interface LocationDetailsProps {
  locationData: LocationData;
}

const LocationDetails: React.FC<LocationDetailsProps> = ({ locationData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 transition-all duration-300 ease-in-out hover:shadow-lg">
      <h4 className="text-xl font-bold text-indigo-700 mb-3">{locationData.name_location}</h4>
      <div className="text-gray-700 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
        <p><span className="font-semibold">ID:</span> {locationData.id}</p>
        <p><span className="font-semibold">Latitude:</span> {locationData.latitude}</p>
        <p><span className="font-semibold">Longitude:</span> {locationData.longitude}</p>
        <p><span className="font-semibold">Date:</span> {new Date(locationData.date).toLocaleDateString()}</p>
      </div>

      {locationData.ges_id && locationData.ges_id.length > 0 && (
        <div className="mt-5 border-t pt-4 border-gray-200">
          <h5 className="font-semibold text-lg text-gray-800 mb-3">GES Data:</h5>
          {locationData.ges_id.map((ges) => (
            <div key={ges.id} className="ml-4 pl-4 border-l-4 border-indigo-200 mb-4 bg-indigo-50 p-4 rounded-md">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Date & Time:</span> {`${ges.day}/${ges.month}/${ges.year} ${ges.hours}:00`}
              </p>
              {ges.so2_id && ges.so2_id.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {ges.so2_id.map((so2) => (
                    <li key={so2.id} className="mb-1">
                      <span className="font-medium">{so2.so2_name.toUpperCase()}:</span> {so2.so2}, <span className="font-medium">AOD:</span> {so2.aod}, <span className="font-medium">O3:</span> {so2.o3}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const So2 = () => {
  const [yearMonthList, setYearMonthList] = useState<YearMonth[]>([]);
  const [selected, setSelected] = useState<YearMonth | null>(null);
  const [dataso2, setDataso2] = useState<LocationData[]>([]);
  const [uniqueLocationNames, setUniqueLocationNames] = useState<string[]>([]);
  const [selectedLocationName, setSelectedLocationName] = useState<string | null>(null);
  const [displayedLocationData, setDisplayedLocationData] = useState<LocationData[] | null>(null);


  useEffect(() => {
    const fetchYearMonth = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/Separate");
        const data = await res.json();
        setYearMonthList(data);
        if (data.length > 0) {
          setSelected(data[0]);
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาด", err);
      }
    };
    fetchYearMonth();
  }, []);

  useEffect(() => {
    const fetchSO2Data = async () => {
      if (selected) {
        try {
          const res = await fetch(
            `http://localhost:3005/api/gesso2/${selected.ges_year}/${selected.ges_month}`
          );
          const data = await res.json();
          setDataso2(data);
          setSelectedLocationName(null); 
          setDisplayedLocationData(null); 
        } catch (err) {
          console.error("เกิดข้อผิดพลาด", err);
        }
      }
    };
    fetchSO2Data();
  }, [selected]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = e.target.value.split("-");
    setSelected({
      ges_year: Number(year),
      ges_month: Number(month),
    });
  };

  useEffect(() => {
    if (dataso2.length > 0) {
      const names = Array.from(new Set(dataso2.map(item => item.name_location)));
      setUniqueLocationNames(names);
    } else {
      setUniqueLocationNames([]);
      setSelectedLocationName(null);
      setDisplayedLocationData(null);
    }
  }, [dataso2]);

  useEffect(() => {
    if (selectedLocationName && dataso2.length > 0) {
      const dataToShow = dataso2.filter(item => item.name_location === selectedLocationName);
      setDisplayedLocationData(dataToShow);
    } else {
      setDisplayedLocationData(null);
    }
  }, [selectedLocationName, dataso2]);

  const handleLocationButtonClick = (locationName: string) => {
    setSelectedLocationName(locationName);
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-2 border-indigo-500 pb-3">
          ข้อมูลคุณภาพอากาศ
        </h2>

        {/* Section: Select Year-Month */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">เลือกปี-เดือน:</h3>
          <select
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 bg-white"
            onChange={handleChange}
            value={
              selected ? `${selected.ges_year}-${selected.ges_month}` : ""
            }
          >
            {yearMonthList.length > 0 ? (
                yearMonthList.map((item) => (
                    <option
                        key={`${item.ges_year}-${item.ges_month}`}
                        value={`${item.ges_year}-${item.ges_month}`}
                    >
                        {item.ges_month}/{item.ges_year}
                    </option>
                ))
            ) : (
                <option value="">กำลังโหลดปี-เดือน...</option>
            )}
          </select>
        </div>

        <hr className="my-8 border-t-2 border-gray-200" />

        {/* Section: Select Location Buttons */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">เลือกสถานที่เพื่อดูข้อมูล:</h3>
          <div className="flex flex-wrap gap-3">
            {uniqueLocationNames.length > 0 ? (
              uniqueLocationNames.map((name, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationButtonClick(name)}
                  className={`px-5 py-2 rounded-full transition-all duration-200 ease-in-out
                    ${selectedLocationName === name
                      ? 'bg-indigo-600 text-white shadow-lg transform scale-105 ring-2 ring-indigo-300' // Selected button
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-800' // Normal button
                    }`}
                >
                  {name}
                </button>
              ))
            ) : (
              <p className="text-gray-500 italic">กำลังโหลดชื่อสถานที่... หรือไม่พบข้อมูล</p>
            )}
          </div>
        </div>

        <hr className="my-8 border-t-2 border-gray-200" />

        {/* Section: Display Location Data */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            ข้อมูลสำหรับ {selectedLocationName ? <span className="text-indigo-700">{selectedLocationName}</span> : 'สถานที่ที่เลือก'}:
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-inner border border-gray-200">
            {displayedLocationData && displayedLocationData.length > 0 ? (
              displayedLocationData.map((item) => (
                // Use a proper unique key if possible, if not, index is fallback.
                // Assuming item.id is unique across all loaded data for that month.
                <LocationDetails key={item.id} locationData={item} />
              ))
            ) : (
              <p className="text-gray-600 text-lg text-center py-8">
                กรุณาเลือกสถานที่จากด้านบนเพื่อแสดงข้อมูล
                {/* Optional: Add a spinner or different message if still loading */}
                {(!selectedLocationName && dataso2.length > 0) && " (เลือกสถานที่)"}
                {dataso2.length === 0 && selected && " (กำลังโหลดข้อมูล...)"}
                {dataso2.length === 0 && !selected && " (เลือกปี-เดือนก่อน)"}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default So2;