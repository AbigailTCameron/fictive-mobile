import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import HomeFooter from '../components/footers/HomeFooter';
import ProfileCentered from '../components/profile/ProfileCentered';

const ProfileScreen = ({user, userDetails, setUserDetails}) => {
  const navigation = useNavigation(); 

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []); 

  return (
    <View className="flex-1">
        <View className="flex-0 bg-[#0059f7]"/>

        <SafeAreaView className="flex-0 z-50 bg-[#0058f7]">
              <HomeHeader user={user} userDetails={userDetails}/>
        </SafeAreaView>


        <View
          className="flex-1 bg-white items-center justify-center"
        >
          <ProfileCentered user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>

        </View>


        <SafeAreaView className="flex-0 bg-white">
              <HomeFooter user={user}/>
        </SafeAreaView>

        <View className="flex-0 bg-white"/>
    </View>
  )
}

export default ProfileScreen