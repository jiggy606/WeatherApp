import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { theme } from '../theme'
import {debounce} from 'lodash'

import { MagnifyingGlassIcon, MapPinIcon } from 'react-native-heroicons/outline'
import {CalendarDaysIcon, SunIcon} from 'react-native-heroicons/solid'
import { fetchLocations, fetchWeatherForecast } from '../api/weather'

export default function HomeScreen() {
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});

    const handleLocation = (loc) => {
        console.log('location: ', loc);
        setLocations([]);
        toggleSearch(false);
        fetchWeatherForecast({
            cityName: loc.name,
            days: '7'
        }).then.apply(data => {
            setWeather(data);
            console.log('got forecast ', data);
        })
    }

    const handleSearch = value => {
        // fetch locations
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then(data => {
                setLocations(data);
        })
        }
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 1000), []);

    const {current, location} = weather;
    
    return (
        <View style={styles.cotainer}>
            <StatusBar style='light' />
            <Image source={require('../assets/images/umberto.jpg')} style={{ position: 'absolute', height: '100%', width: '100%'}} blurRadius={70} />

            <SafeAreaView style={{display: "flex", flex: 1}}>
                <View style={{ marginLeft: 16, marginRight: 16, position: 'relative',  zIndex: 50, height: '7%'}}>
                    <View style={{ backgroundColor:  showSearch? theme.bgWhite(0.2): 'transparent', flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'center', borderRadius: 9999 }}>
                        {
                            showSearch ? (
                                <TextInput
                                    onChangeText={handleTextDebounce}
                                    placeholder='Search City'
                                    placeholderTextColor={'lightgray'}
                                    style={{ paddingLeft: 24, height: 48, flex: 1, fontSize: 16, color: 'white' }}
                                />
                            ):null
                        }
                        <TouchableOpacity onPress={() => toggleSearch(!showSearch)} style={{ backgroundColor: theme.bgWhite(0.3), borderRadius: 999, padding: 12, margin: 4 }}>
                            <MagnifyingGlassIcon size='20' color='white' />
                        </TouchableOpacity>
                    </View>
                    {
                        locations.length > 0 && showSearch ? (
                            <View style={{ position: 'absolute', width: '100%', backgroundColor: 'lightgray', top: 64, borderRadius: 24 }}>
                                {
                                    locations.map((loc, index) => {
                                        return (
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: 'row', alignItems: 'center', borderWidth: 0, padding: 12, paddingLeft: 16, paddingRight: 16,
                                                    marginBottom: 4,
                                                    /* borderBottomWidth: 2,
                                                    borderBottomColor: 'blue' */
                                                    /* onPress={() => handleLocation(loc)} */
                                                }}
                                                key={index}
                                            >
                                                <MapPinIcon size="20" color='gray' />
                                                <Text style={{ fontSize: 20, marginLeft: 8 }}>{loc?.name}, {loc?.country}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        ):null
                    }
                </View>

                {/* forecast */}
                <View style={{ marginLeft: 16, marginRight: 16, display: 'flex', justifyContent: 'space-around', flex: 1, marginBottom: 8 }}>
                    {/* location */}
                    <Text style={{ color: "white", textAlign: "center", fontSize: 40, fontWeight: 700 }}>
                        {location?.name},
                        <Text style={{ fontSize: 20, fontWeight: 500, color: 'lightgray' }}>
                            {" "+location?.country}
                        </Text>
                    </Text>
                    {/* weather image */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        {/* <Image
                            source={require('../assets/images/laptop.jpg')}
                            style={{width: 200, height: 200}}
                        /> */}
                        <SunIcon color="orange" width="200" height="200" />
                    </View>
                    {/* degree stuff */}
                    <View style={{ marginTop: 8 }}>
                        <Text style={{ textAlign: "center", fontWeight: 700, color: 'white', fontSize: 60 }}>23</Text>
                        <Text style={{textAlign: "center", color: 'white', fontSize:20, letterSpacing: 5}}>Partly Cloudy</Text>
                    </View>
                    {/* other stats */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16, marginRight: 16}}>
                        <View style={{ flexDirection: 'row', marginLeft: 8, alignItems: 'center'}}>
                            <Image source={require('../assets/images/rain.jpg')} style={{height: 24, width:24}} />
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 600, marginLeft: 8}}>
                                Mild
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 8, alignItems: 'center'}}>
                            <Image source={require('../assets/images/rainy.jpg')} style={{height: 24, width:24}} />
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 600, marginLeft: 8}}>
                                30%
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 8, alignItems: 'center'}}>
                            <Image source={require('../assets/images/sun.jpg')} style={{height: 24, width:24}} />
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 600, marginLeft: 8}}>
                                13:00
                            </Text>
                        </View>
                    </View>
                </View>
                {/* other days */}
                <View style={{marginBottom: 12, marginTop: 12}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginRight: 20, paddingBottom: 10}}>
                            <CalendarDaysIcon color='white' size='22' />
                            <Text style={{color: 'white', fontSize: 16, marginLeft: 8}}>Daily Forecast</Text>
                        </View>
                        <ScrollView
                            horizontal
                            contentContainerStyle={{ paddingHorizontal: 15 }}
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={{ marginRight: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', width: 132, height: 84, borderRadius: 96, paddingTop: 12, paddingBottom: 12, backgroundColor: theme.bgWhite(0.25)}}>
                                <Image source={require('../assets/images/sun.jpg')} style={{ height: 24, width: 24, marginBottom: 3 }} />
                                <Text style={{color: 'white'}}>Monday</Text>
                                <Text style={{color: 'white', fontSize: 18,  fontWeight: 600}}>13</Text>
                        </View>
                        <View style={{ marginRight: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', width: 132, height: 84, borderRadius: 96, paddingTop: 12, paddingBottom: 12, backgroundColor: theme.bgWhite(0.15)}}>
                                <Image source={require('../assets/images/sun.jpg')} style={{ height: 24, width: 24, marginBottom: 3 }} />
                                <Text style={{color: 'white'}}>Monday</Text>
                                <Text style={{color: 'white', fontSize: 18,  fontWeight: 600}}>13</Text>
                            </View>
                            <View style={{ marginRight: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', width: 132, height: 84, borderRadius: 96, paddingTop: 12, paddingBottom: 12, backgroundColor: theme.bgWhite(0.15)}}>
                                <Image source={require('../assets/images/sun.jpg')} style={{ height: 24, width: 24, marginBottom: 3 }} />
                                <Text style={{color: 'white'}}>Monday</Text>
                                <Text style={{color: 'white', fontSize: 18,  fontWeight: 600}}>13</Text>
                            </View>
                            <View style={{ marginRight: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', width: 132, height: 84, borderRadius: 96, paddingTop: 12, paddingBottom: 12, backgroundColor: theme.bgWhite(0.15)}}>
                                <Image source={require('../assets/images/sun.jpg')} style={{ height: 24, width: 24, marginBottom: 3 }} />
                                <Text style={{color: 'white'}}>Monday</Text>
                                <Text style={{color: 'white', fontSize: 18,  fontWeight: 600}}>13</Text>
                            </View>
                            <View style={{ marginRight: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', width: 132, height: 84, borderRadius: 96, paddingTop: 12, paddingBottom: 12, backgroundColor: theme.bgWhite(0.15)}}>
                                <Image source={require('../assets/images/sun.jpg')} style={{ height: 24, width: 24, marginBottom: 3 }} />
                                <Text style={{color: 'white'}}>Monday</Text>
                                <Text style={{color: 'white', fontSize: 18,  fontWeight: 600}}>13</Text>
                            </View>
                            <View style={{ marginRight: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', width: 132, height: 84, borderRadius: 96, paddingTop: 12, paddingBottom: 12, backgroundColor: theme.bgWhite(0.15)}}>
                                <Image source={require('../assets/images/sun.jpg')} style={{ height: 24, width: 24, marginBottom: 3 }} />
                                <Text style={{color: 'white'}}>Monday</Text>
                                <Text style={{color: 'white', fontSize: 18,  fontWeight: 600}}>13</Text>
                            </View>
                        </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );    
}

const styles = StyleSheet.create({
    cotainer: {
        position: 'relative',
        flex: 1,
    },
})