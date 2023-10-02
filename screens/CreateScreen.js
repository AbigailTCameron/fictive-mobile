import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import CreateForm from '../components/CreateForm';

const CreateScreen = ({user, userDetails, setUserDetails}) => {
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

        <ScrollView>
          <CreateForm user={user} userDetails={userDetails} setUserDetails={setUserDetails}/>
        </ScrollView>

        <View className="flex-0 bg-white"/>

    </View>
  )
}

export default CreateScreen