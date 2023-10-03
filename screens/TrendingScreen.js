import { View, Text, SafeAreaView, Appearance } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import HomeFooter from '../components/footers/HomeFooter';
import { fetchTrending } from '../components/queries/fetchUserDetails';
import TrendingPage from '../components/TrendingPage';

const TrendingScreen = ({user, userDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []); 

  const fetchTrendingData = useCallback(async () => {
    try {
      await fetchTrending(setLoading, setTrending);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTrendingData();
    }, [fetchTrendingData])
  );

  return (
    <View className="flex-1">
        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-[#0059f7]'}`}/>

        <SafeAreaView className={`flex-0 z-50 ${isDarkTheme ? 'bg-black' : 'bg-[#0058f7]'}`}>
            <HomeHeader user={user} userDetails={userDetails}/>
        </SafeAreaView>

        <View className={`flex-1 ${isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'}`}>
            <TrendingPage trending={trending}/>
        </View>

        <SafeAreaView className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}>
            <HomeFooter user={user}/>
        </SafeAreaView>

        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}/>

    </View>
  )
}

export default TrendingScreen