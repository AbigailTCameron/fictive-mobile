import { View, Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import HomeHeader from '../components/headers/HomeHeader'
import Profile from '../components/Profile'
import HomeFooter from '../components/footers/HomeFooter'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Published from '../components/published/Published'
import { fetchPublished } from '../components/queries/fetchUserDetails'
import LoadingPage from './loading/LoadingPage'

const PublishedScreen = ({user, userDetails}) => {

  const navigation = useNavigation(); 
  const [published, setPublished] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false);

  const fetchPublishedData = useCallback(async () => {
    try {
      await fetchPublished(setLoading, userDetails, setPublished);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }, [userDetails]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    fetchPublishedData()
    .then(() => {
      setRefreshing(false);
    })
    .catch((error) => {
      console.log("Error refreshing data:", error);
      setRefreshing(false); 
    })

  }, [fetchPublishedData])

  useFocusEffect(
    useCallback(() => {
      fetchPublishedData();
    }, [fetchPublishedData])
  );


  return (
    <View className="flex-1">
      <View className="flex-0 bg-[#0059f7]"/>

          <SafeAreaView className="flex-0 z-50 bg-[#0058f7]">
              <HomeHeader user={user} userDetails={userDetails}/>
          </SafeAreaView>

          

          <ScrollView
            className="flex-1 bg-gray-100"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
          >
            <Profile user={user} userDetails={userDetails}/>
            <Published user={user} userDetails={userDetails} published={published}/>

          </ScrollView>


          <SafeAreaView className="flex-0 bg-white">
              <HomeFooter user={user}/>
          </SafeAreaView>

      <View className="flex-0 bg-white"/>
    </View>
  )
}

export default PublishedScreen