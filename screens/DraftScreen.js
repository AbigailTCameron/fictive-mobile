import { View, SafeAreaView, ScrollView, RefreshControl, Appearance } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import HomeHeader from '../components/headers/HomeHeader'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import HomeFooter from '../components/footers/HomeFooter';
import Profile from '../components/Profile';
import { fetchDrafts } from '../components/queries/fetchUserDetails';
import Drafts from '../components/Drafts';
import LoadingPage from './loading/LoadingPage';

const DraftScreen = ({user, userDetails}) => {
  const [draftsData, setDraftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation();

  const fetchData = useCallback(async () => {
    try {
      await fetchDrafts(user, setDraftData, setLoading);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }, [user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []); 

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    fetchData()
    .then(() => {
      setRefreshing(false);
    })
    .catch((error) => {
      console.log("Error refreshing data:", error);
      setRefreshing(false); 
    })

  }, [fetchData])

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );
  
  return (
    <View className="flex-1">
        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-[#0059f7]'}`}/>

        <SafeAreaView className={`flex-0 z-50 ${isDarkTheme ? 'bg-black' : 'bg-[#0058f7]'}`}>
          <HomeHeader user={user} userDetails={userDetails}/>
        </SafeAreaView>


        <ScrollView
            className={`flex-1 ${isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'}`}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
          >
            <Profile user={user} userDetails={userDetails}/>
            <Drafts user={user} draftsData={draftsData}/>


        </ScrollView>


        <SafeAreaView className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-white'} `}>
          <HomeFooter user={user}/>
        </SafeAreaView>

        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}/>
    </View>
  )
}

export default DraftScreen