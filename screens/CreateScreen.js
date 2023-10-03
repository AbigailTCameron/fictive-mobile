import { View, SafeAreaView, ScrollView, Appearance } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import CreateForm from '../components/CreateForm';

const CreateScreen = ({user, userDetails, setUserDetails}) => {
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

        <ScrollView className={`flex-1 ${isDarkTheme ? 'bg-black' : 'bg-gray-100'}`}>
          <CreateForm user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>
        </ScrollView>

        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}/>

    </View>
  )
}

export default CreateScreen