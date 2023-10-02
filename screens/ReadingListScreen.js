import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import HomeHeader from '../components/headers/HomeHeader';
import HomeFooter from '../components/footers/HomeFooter';
import Profile from '../components/Profile';
import ReadingQueue from '../components/ReadingQueue';
import { fetchReadingList } from '../components/queries/fetchUserDetails';

const ReadingListScreen = ({user, userDetails}) => {
  const [readingList, setReadingList] = useState([]); 
  const [loading, setLoading] = useState(true);


  const navigation = useNavigation(); 

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []);

  useEffect(() => {
    fetchReadingList(setLoading, userDetails, setReadingList);
  }, [userDetails])

  return (
    <View className="flex-1">
        <View className="flex-0 bg-[#0059f7]"/>

        <SafeAreaView className="flex-0 z-50 bg-[#0058f7]">
            <HomeHeader user={user} userDetails={userDetails}/>
        </SafeAreaView>
        

        <ScrollView
          className="flex-1 bg-gray-100"
        >
          <Profile user={user} userDetails={userDetails}/>
          <ReadingQueue readingList={readingList} userDetails={userDetails}/>


        </ScrollView>


        <SafeAreaView className="flex-0 bg-white">
            <HomeFooter user={user}/>
        </SafeAreaView>

        <View className="flex-0 bg-white"/>
    </View>
  )
}

export default ReadingListScreen