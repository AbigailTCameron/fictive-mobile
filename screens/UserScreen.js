import { View, Text, SafeAreaView, ScrollView, Appearance } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import { fetchUserData } from '../components/queries/fetchUserDetails';
import LoadingPage from './loading/LoadingPage';
import UserProfile from '../components/UserProfile';
import HomeFooter from '../components/footers/HomeFooter';
import UserBook from '../components/UserBook';

const UserScreen = ({user, userDetails, setUserDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []); 

  const {
    params: {
      username
    }
  } = useRoute(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserData(setLoading, username, setUserData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
  
    fetchData(); 
  }, [username, userDetails]);
  
  if(loading){
    return (
      <LoadingPage />
    )
  }


  return (
    <View className="flex-1">
        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-[#0059f7]'}`}/>

        <SafeAreaView className={`flex-0 z-50 ${isDarkTheme ? 'bg-black' : 'bg-[#0058f7]'}`}>
          <HomeHeader user={user} userDetails={userDetails}/>
        </SafeAreaView>

        <ScrollView className={`flex-1 ${isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'}`}>
          <UserProfile userData={userData} userDetails={userDetails} setUserDetails={setUserDetails}/>
          <UserBook userData={userData} userDetails={userDetails}/>

        </ScrollView>

        <SafeAreaView className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}>
          <HomeFooter user={user}/>
        </SafeAreaView>

        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}/>
            

    </View>
  )
}

export default UserScreen