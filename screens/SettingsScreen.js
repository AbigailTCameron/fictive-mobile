import { View, Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import HomeHeader from '../components/headers/HomeHeader';
import HomeFooter from '../components/footers/HomeFooter';
import Settings from '../components/Settings';

const SettingsScreen = ({user, userDetails, setUserDetails}) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []); 

  useFocusEffect(
    useCallback(() => {
    }, [])
  );


  return (
    <View className="flex-1">
        <View className="flex-0 bg-[#0059f7]"/>

        <SafeAreaView className="flex-0 z-50 bg-[#0058f7]">
            <HomeHeader user={user} userDetails={userDetails}/>
        </SafeAreaView>

        <ScrollView 
          className="flex-1"
          refreshControl={<RefreshControl refreshing={refreshing} />}
        >
          <Settings userDetails={userDetails} setUserDetails={setUserDetails}/>

        </ScrollView>

        <SafeAreaView className="flex-0 bg-white">
            <HomeFooter user={user}/>
        </SafeAreaView>

        <View className="flex-0 bg-white"/>


    </View>
  )
}

export default SettingsScreen