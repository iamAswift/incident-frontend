function AddressSearch({ onLocationSelect }) {
  const map = useMap();

  React.useEffect(() => {
    const geocoder = LControlGeocoder.geocoder();

    const control = LControlGeocoder.control({
      geocoder,
      defaultMarkGeocode: false,
    })
      .on("markgeocode", function (e) {

        const latlng = e.geocode.center;

        map.setView(latlng, 16);

        if (onLocationSelect) {
          onLocationSelect({
            lat: latlng.lat,
            lng: latlng.lng,
          });
        }

        L.marker(latlng).addTo(map);
      })
      .addTo(map);

    return () => map.removeControl(control);
  }, [map]);

  return null;
}