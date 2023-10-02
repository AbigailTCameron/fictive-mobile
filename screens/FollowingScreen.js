import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import Profile from '../components/Profile';
import HomeFooter from '../components/footers/HomeFooter';
import FollowingQueue from '../components/FollowingQueue';
import { fetchFollowingProfiles } from '../components/queries/fetchUserDetails';

const FollowingScreen = ({user, userDetails}) => {
  const navigation = useNavigation(); 

  const [followingList, setFollowingList] = useState([]); 
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []);

  useEffect(() => {
    fetchFollowingProfiles(setLoading, userDetails.following, setFollowingList)
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
            <FollowingQueue followingList={followingList}/>

          </ScrollView>


          <SafeAreaView className="flex-0 bg-white">
              <HomeFooter user={user}/>
          </SafeAreaView>

        <View className="flex-0 bg-white"/>
    </View>
  )
}

export default FollowingScreen