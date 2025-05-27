"use client";
import { useEffect, useState } from "react";

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

const DownloadPage = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<Record<number, string>>({});
  const [viewData, setViewData] = useState<Record<number, MeteorologicalData[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://10.90.1.118:3001/api/locationget");
        const data = await res.json();
        setLocations(data);

        // Set default selected months
        const defaults: Record<number, string> = {};
        data.forEach((loc: LocationData) => {
          const latestMonth = getLatestMonth(loc.meteorological_id);
          if (latestMonth) defaults[loc.id] = latestMonth;
        });
        setSelectedMonths(defaults);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const getAvailableMonths = (data: MeteorologicalData[]) => {
    const set = new Set<string>();
    data.forEach((d) => {
      const monthKey = `${d.year}-${String(d.month).padStart(2, "0")}`;
      set.add(monthKey);
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  };

  const getLatestMonth = (data: MeteorologicalData[]) => {
    const months = getAvailableMonths(data);
    return months.length > 0 ? months[0] : "";
  };

  const downloadCSV = (locationName: string, month: string, data: MeteorologicalData[]) => {
    const filtered = data.filter(
      (d) => `${d.year}-${String(d.month).padStart(2, "0")}` === month
    );

    const headers = [
      "Date",
      "Hour",
      "Temperature",
      "Humidity",
      "SLP",
      "Rain",
      "Windspeed10m",
      "WindDirection10m",
      "LowCloud",
      "HighCloud",
    ];

    const rows = filtered.map((m) => [
      `${m.year}-${String(m.month).padStart(2, "0")}-${String(m.day).padStart(2, "0")}`,
      m.hours,
      m.temperaturde,
      m.humidity,
      m.slp,
      m.rain,
      m.windspeed10m,
      m.winddirdedtion10m,
      m.lowcloud,
      m.highcloud,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${locationName}_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewData = (locationId: number, data: MeteorologicalData[], month: string) => {
    const filtered = data.filter(
      (d) => `${d.year}-${String(d.month).padStart(2, "0")}` === month
    );
    setViewData((prev) => ({ ...prev, [locationId]: filtered }));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">ดูข้อมูลอุตุนิยมวิทยา & ดาวน์โหลด CSV</h1>

      {locations.map((loc) => {
        const months = getAvailableMonths(loc.meteorological_id);
        const selected = selectedMonths[loc.id] || "";

        return (
          <div key={loc.id} className="border p-4 mb-6 rounded shadow">
            <h2 className="text-lg font-semibold">{loc.name_location}</h2>

            <div className="my-2">
              <label className="mr-2">เลือกเดือน:</label>
              <select
                value={selected}
                onChange={(e) =>
                  setSelectedMonths((prev) => ({ ...prev, [loc.id]: e.target.value }))
                }
                className="border px-2 py-1 rounded"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-2 my-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() =>
                  handleViewData(loc.id, loc.meteorological_id, selected)
                }
              >
                ดูข้อมูล
              </button>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() =>
                  downloadCSV(loc.name_location, selected, loc.meteorological_id)
                }
              >
                ดาวน์โหลด CSV
              </button>
            </div>

            {/* แสดงข้อมูลถ้ามี */}
            {viewData[loc.id] && (
              <div className="overflow-x-auto mt-4">
                <table className="table-auto border-collapse border w-full text-sm">
                  <thead>
                    <tr>
                      <th className="border px-2">Date</th>
                      <th className="border px-2">Hour</th>
                      <th className="border px-2">Temp</th>
                      <th className="border px-2">Humidity</th>
                      <th className="border px-2">Rain</th>
                      <th className="border px-2">Wind Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewData[loc.id].map((d) => (
                      <tr key={d.id}>
                        <td className="border px-2">
                          {`${d.year}-${String(d.month).padStart(2, "0")}-${String(
                            d.day
                          ).padStart(2, "0")}`}
                        </td>
                        <td className="border px-2">{d.hours}</td>
                        <td className="border px-2">{d.temperaturde} °C</td>
                        <td className="border px-2">{d.humidity} %</td>
                        <td className="border px-2">{d.rain} mm</td>
                        <td className="border px-2">{d.windspeed10m} m/s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DownloadPage;
