import React, {useState, useEffect} from 'react';
import MapView, { Marker} from'react-native-maps';
import { StyleSheet, TextInput, View, Button, Alert, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

export default function App() {

  const [address, setAddress] = useState('');
  const [region, setRegion] = useState(
    {latitude: 0,
    longitude: 0}
  );

  
  useEffect(() => {
    (async() => {
      let  { status} = await Location.requestForegroundPermissionsAsync();
      if  (status!==   'granted') {
        Alert.alert('No   permissionto get location')
        return;
      }
      let  location= await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      })
      //console.log(location);
    })();
  }, []);

  
  

  const getCoordinates = address => {
    const KEY = process.env.EXPO_MAPQUEST_API_KEY || Constants.manifest.extra.apiKey;
    console.log(address);
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${address}`)
    .then(response=>  response.json())
    .then(responseJson=>{ 
      setRegion(
        {
          latitude: responseJson.results[0].locations[0].displayLatLng.lat,
          longitude: responseJson.results[0].locations[0].displayLatLng.lng,
          latitudeDelta:0.0322,
          longitudeDelta:0.0221,
        }
      )
    })
    .catch(error=> { Alert.alert('Error',error); });
  }
  return (
    <View style={styles.container}>
      
      <MapView
      style={styles.map}
      region={region}
        >
        <Marker coordinate={region}/>
        </MapView>
        <View style={{flex: 1}}>
        <TextInput 
        style={styles.input}
        onChangeText={address=> setAddress(address)}
        value={address} />
        <Button onPress={() => getCoordinates(address)} title='Show' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  input: {
    width:200,
    borderColor:'gray',
    borderWidth:1
  },
  map: {
    flex:3,
    width: "100%",
    height: "100%"
  }

  
});



/*
*/