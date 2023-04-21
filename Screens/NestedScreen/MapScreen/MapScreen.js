import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Text } from "react-native";

export function MapScreen({ route }) {
  if (!route.params.item.coords) {
    return (
      <View style={{ flex: 1,paddingHorizontal: 15 }}>
        <Text style={{marginTop: 150,alignSelf: 'center',fontSize: 26,textAlign: 'center'}}>У этой фотографии отсутствует геолокация</Text>
      </View>
    )
  }

  const { latitude, longitude } = route.params.item.coords;

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={{ latitude, longitude, latitudeDelta: 0.001, longitudeDelta: 0.006, }} >
        <Marker coordinate={{ latitude, longitude }} title="Photo location" />
      </MapView>
    </View>
  );
};