import { View, SafeAreaView, ScrollView, RefreshControl, StatusBar, Appearance } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Categories from '../components/Categories';
import HomeHeader from '../components/headers/HomeHeader';
import Posts from '../components/Posts';
import { fetchBooks } from '../components/queries/fetchUserDetails';
import HomeFooter from '../components/footers/HomeFooter';

const HomeScreen = ({user, userDetails, setUserDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const [books, setBooks] = useState([]);
  const [batchSize, setBatchSize] = useState(10);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);

  const [selectedTheme, setSelectedTheme] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const fetchBookData = useCallback(async () => {
    try {
      await fetchBooks(setRefreshing, setBooks, batchSize, setHasMoreBooks);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }, []);


  const onRefresh = useCallback(() => {
    setRefreshing(true);

    fetchBookData()
    .then(() => {
      setRefreshing(false);
    })
    .catch((error) => {
      console.log("Error refreshing data:", error);
      setRefreshing(false); 
    })

  }, [fetchBookData])


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []); 

  useFocusEffect(
    useCallback(() => {
      fetchBookData();
    }, [fetchBookData])
  );


  return (
    <View className="flex-1">
        <StatusBar
          backgroundColor='white'
        />

        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-[#0059f7]'}`}/>
         
          <SafeAreaView className={`flex-0 z-50 ${isDarkTheme ? 'bg-black' : 'bg-[#0058f7]'}`}>
              <HomeHeader user={user} userDetails={userDetails}/>
          </SafeAreaView>

         
          <ScrollView 
            className={`flex-1 ${isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'}`}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
          > 
              <Categories selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}/>  
              <Posts user={user} setUserDetails={setUserDetails} posts={books} userDetails={userDetails} selectedTheme={selectedTheme} hasMoreBooks={hasMoreBooks} setBatchSize={setBatchSize}/>
          </ScrollView>   


          <SafeAreaView className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}>
              <HomeFooter user={user}/>
          </SafeAreaView>

          <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}/>
            
    </View>
 
  )
}

export default HomeScreen