import { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import Geocoder from "react-mapbox-gl-geocoder";
import "./style.css";
import locationIcon from "../../../assets/svgs/location.svg";
import markerIcon from "../../../assets/svgs/marker.svg";
import axios from "axios";

export default function SelectLocationPanel({
	width,
	height,
	value,
	setValue,
	placeholder,
	setVisibility,
}) {
	//TODO: API should be on the backend and protected.
	const MAPBOX_API_TOKEN =
		"pk.eyJ1Ijoicm9taWthcyIsImEiOiJjazg0b2ZrOWcwc25mM29xdHFlMHdwenpsIn0.EpdSDBQASiP_K00nvaMMRA";
	const [viewport, setViewport] = useState({
		latitude: 45.50884,
		longitude: -73.58781,
		zoom: 13,
	});
	const [marker, setMarker] = useState(undefined);

	const MyInput = (props) => {
		return<input {...props} placeholder={placeholder} />
	};

	return (
		<div className="d-flex flex-column" 
		style={{ width: width, height: height }}>
			<div
				className="map-container"
			>
				<ReactMapGL
					mapboxApiAccessToken={MAPBOX_API_TOKEN}
					mapStyle="mapbox://styles/mapbox/streets-v11"
					width="100%"
					height="100%"
					{...viewport}
				>
					{marker && (
						<Marker
							longitude={marker.longitude}
							latitude={marker.latitude}
						>
							<div className="marker-container">
								<img src={markerIcon} alt="marker" />
							</div>
						</Marker>
					)}

					<div className="mapbox-geocoder-container">
						<img
							className="mr-3"
							src={locationIcon}
							alt="location"
						/>
						<Geocoder
							mapboxApiAccessToken={MAPBOX_API_TOKEN}
							onSelected={(viewport, item) => {
								setViewport(viewport);
								setMarker({
									name: item.place_name,
									longitude: item.center[0],
									latitude: item.center[1],
								});
								setValue(item.place_name);
							}}
							viewport={viewport}
							hideOnSelect={true}
							limit={4}
							initialInputValue={value}
							queryParams={{ types: "address" }}
							updateInputOnSelect={true}
							inputComponent={MyInput}
						/>
					</div>
				</ReactMapGL>
			</div>
			<div
				className="mt-5 current-address-button clickable"
				onClick={() => {
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition((pos) => {
							const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${pos.coords.longitude}%2C${pos.coords.latitude}.json?access_token=${MAPBOX_API_TOKEN}&types=address`;

							axios
								.get(url)
								.then((res) =>
									setValue(res.data.features[0].place_name)
								)
								.catch((err) => setValue("MAPBOX API FAILED"));
							setViewport({
								latitude: pos.coords.latitude,
								longitude: pos.coords.longitude,
								zoom: 13,
							});
							setMarker({
								longitude: pos.coords.longitude,
								latitude: pos.coords.latitude,
							});
						});
						setVisibility(false)
					}
				}}
			>
				Use Current Address
			</div>
		</div>
	);
}
