import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from "@/api/axios";
import { Loader2 } from "lucide-react";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DonationsMap = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const defaultPosition = [-1.2921, 36.8219];

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const { data } = await api.get("/donations");
                const available = data.filter(d => d.status === 'Available');
                setDonations(available);
            } catch (error) {
                console.error("Map fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    const getPosition = (donation, index) => {
        const lat = donation.location?.coordinates?.[1];
        const lng = donation.location?.coordinates?.[0];

        if (lat && lng && (lat !== 0 || lng !== 0)) {
            return [lat, lng];
        }
        
        const offset = 0.005 * (index + 1); 
        return [
            defaultPosition[0] + (index % 2 === 0 ? offset : -offset), 
            defaultPosition[1] + (index % 2 === 0 ? -offset : offset)
        ];
    };

    if (loading) {
        return (
            <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-500">Loading Map...</span>
            </div>
        );
    }

    return (
        <div className="h-[600px] w-full relative z-0 rounded-xl overflow-hidden shadow-md border border-gray-200">
            <MapContainer 
                center={defaultPosition} 
                zoom={13} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {donations.map((donation, index) => (
                    <Marker key={donation._id} position={getPosition(donation, index)}>
                        <Popup>
                            <div className="p-1 min-w-[150px]">
                                <h3 className="font-bold text-emerald-700 text-sm mb-1">{donation.title}</h3>
                                <p className="text-xs text-gray-600 mb-2">{donation.pickupLocation}</p>
                                <div className="flex gap-2 mb-2">
                                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">{donation.foodType}</span>
                                    <span className="text-[10px] bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">{donation.quantity}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-2 rounded-md shadow-md text-xs font-medium border border-gray-200">
                {donations.length} Active Donation Points
            </div>
        </div>
    );
};

export default DonationsMap;