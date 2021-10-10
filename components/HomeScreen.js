import React, {
  useState,
  useReducer,
} from 'react';
import { 
  SafeAreaView, 
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { BleManager, Device } from 'react-native-ble-plx';
import { Colors } from "react-native/Libraries/NewAppScreen";


const manager = new BleManager();


const reducer = (state, action) => {
  switch(action.type) {
    case 'ADD_DEVICE':
      const { payload: device } = action;

      // check if the detected device is not already added to the list
      if (device && !state.find((dev) => dev.id === device.id)) {
        return [...state, device];
      }
      return state;
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}


const DeviceInfo = ({device}) => {
  const deviceStyle = {
    backgroundColor: '#ffff',
    margin: 15,
    borderRadius: 16,
    padding: 12,
    elevation: 4,
    shadowColor: 'rgba(60, 64, 67, 0.3)',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  }
  
  return(
    <View style={deviceStyle}>
      <Text>name: {device.name}</Text>
      <Text>localName: {device.localName}</Text>
      <Text>id: {device.id}</Text>
      <Text>rssi: {device.rssi}</Text>
      <Text>isConnectable: {String(device.isConnectable)}</Text>
      {/* <Text>serviceData: {device.serviceData}</Text> */}
      {/* <Text>serviceUUIDs: {device.serviceUUIDs}</Text> */}
    </View>
  );
}

const HomeScreen = () => {
  const [devices, dispatch] = useReducer(reducer, []);

  const scanDevice = () => {
    console.log("scan button is pressed!");
    manager.startDeviceScan(null, {allowDuplicates: false}, (error, scannedDevice) => {
      if (error) {
        console.warn("error scanning:", error);
        return;
      }

      if (scannedDevice) {
        dispatch({type: 'ADD_DEVICE', payload: scannedDevice})
      }
    });
    setTimeout(() => {
      manager.stopDeviceScan();
      console.log("finished scanning!");
    }, 1000);
  }

  const clearDevice = () => {
    dispatch({type: 'CLEAR'});
  }

  return (
    <SafeAreaView>
      
      <View style={{backgroundColor: '#eee'}}>
        <TouchableOpacity style={styles.button} onPress={() => {scanDevice()}}>
          <Text style={{fontSize: 24, color: "#fff", textAlign: 'center'}}>Start Scanning</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => {clearDevice()}}>
          <Text style={{fontSize: 24, color: "#fff", textAlign: 'center'}}>Clear Scanning</Text>
        </TouchableOpacity>

        <FlatList 
          keyExtractor={(item) => item.id}
          data ={devices}
          // data ={testArray}
          renderItem={({item}) => <DeviceInfo device={item}/>}
        />
      </View>

      
    
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF5236',
    paddingTop: StatusBar.currentHeight,
  },
  button: {
    backgroundColor: 'steelblue',
    padding: 20,
  },
  flexView: {
    flex: 1,
    // width: 60, 
    height: 50,
    backgroundColor: 'pink',
  },
});

export { HomeScreen };