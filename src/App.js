import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import useSWR from "swr"; // React hook to fetch the data
import lookup from "country-code-lookup"; // npm module to get ISO Code for countries

import "./App.scss";

import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiaXNoaXRhMDgiLCJhIjoiY2s4ejN3YTIzMDAwZTNmb3FhdHRqaGNlYSJ9.3zZiRFfM5VG5OtTVz3TPxw";

function App() {
  const mapboxElRef = useRef(null); // to render map

  const fetcher = (url) =>
    fetch(url)
      .then(r => r.json())
      .then((data) =>
        data.map((point, index) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              point.coordinates.longitude,
              point.coordinates.latitude
            ]
          },
          properties: {
            id: index,
            country: point.country,
            province: point.province,
            cases: point.stats.confirmed,
            deaths: point.stats.deaths
          }
        }))
      );

  const { data } = useSWR("https://corona.lmao.ninja/v2/jhucsse", fetcher);

  //initialize map
  useEffect(() => {
    if (data) {
    const map = new mapboxgl.Map({
      container: mapboxElRef.current,
      style: "mapbox://styles/ishita08/ck8z4r9xd028u1imnxcn6mn8t",
      center: [75, 27],
      zoom: 2
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.once("load", function() {
      map.addSource("points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: data
        }
      });

      map.addLayer({
        id: "circles",
        source: "points",
        type: "circle",
        paint: {
          "circle-opacity": 0.75,
          "circle-stroke-width": 1,
          "circle-radius": 4,
          "circle-color": "#FFEB3B"
        }
      });
    });
   }
  }, [data]);

  return (
    <div className="App">
      <div className="mapContainer">
        { }
        <div className="mapBox" ref={mapboxElRef} />
      </div>
    </div>
  );
}

export default App;