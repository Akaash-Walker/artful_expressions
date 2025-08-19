import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
    return (
        <MapContainer
            center={[42.876188298136285, -71.29978824228384]} // Boston coords as example
            zoom={16}
            style={{height: "400px", width: "100%"}}
        >
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[42.876188298136285, -71.29978824228384]}>
                <Popup>
                    <a href={"https://www.google.com/maps/place/127+Rockingham+Rd+%2318,+Derry,+NH+03038/@42.8760664,-71.3023846,17z/data=!3m1!4b1!4m6!3m5!1s0x89e25370039aaaab:0xbeabc00a025e8408!8m2!3d42.8760625!4d-71.2998097!16s%2Fg%2F11rnf9v2sy?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D"}
                       target="_blank"
                       rel="noopener noreferrer"
                    >
                        127 Rockingham Rd, Derry, NH 03038, USA
                    </a>
                </Popup>
            </Marker>
        </MapContainer>
    );
}
