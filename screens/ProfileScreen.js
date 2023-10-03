import { View, Text, SafeAreaView, ScrollView, Appearance } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import HomeFooter from '../components/footers/HomeFooter';
import ProfileCentered from '../components/profile/ProfileCentered';

const ProfileScreen = ({user, userDetails, setUserDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation(); 

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []); 

  return (
    <View className="flex-1">
        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-[#0059f7]'}`}/>

        <SafeAreaView className={`flex-0 z-50 ${isDarkTheme ? 'bg-black' : 'bg-[#0058f7]'}`}>
              <HomeHeader user={user} userDetails={userDetails}/>
        </SafeAreaView>


        <View className={`flex-1 ${isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'}`}>
          <ProfileCentered user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>
        </View>


        <SafeAreaView className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}>
              <HomeFooter user={user}/>
        </SafeAreaView>

        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}/>
    </View>
  )
}

export default ProfileScreen