import { View, Text, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Appearance } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import HomeHeader from '../components/headers/HomeHeader';
import PublishedHeader from '../components/published/PublishedHeader';
import { fetchPublishedBook } from '../components/queries/fetchUserDetails';
import LoadingPage from './loading/LoadingPage';
import PublishedSection from '../components/published/PublishedSection';

const SinglePublishedScreen = ({user, userDetails, setUserDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation(); 
  const [loading, setLoading] = useState(true);
  const [bookData, setBookData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [editPost, setEditPost] = useState(false); 

  const {
    params: {
      bookId
    }
  } = useRoute(); 

  useLayoutEffect(()  => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []);

  const fetchPublishedData = useCallback(async () => {
    try {
      await fetchPublishedBook(setLoading, bookId, setBookData);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }, [userDetails, bookId]);

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

  if(loading || bookData === null || bookData === undefined){
    return(
      <LoadingPage />
    )
  }

  return (
    <View className={`flex-1 ${isDarkTheme ? 'bg-zinc-800' : ''}`}>

        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-[#0059f7]'}`}/>

        <SafeAreaView className={`flex-0 z-50 ${isDarkTheme ? 'bg-black' : 'bg-[#0058f7]'}`}>
            <HomeHeader user={user} userDetails={userDetails}/>
        </SafeAreaView>

        <PublishedHeader 
          userDetails={userDetails} 
          bookData={bookData} 
          bookId={bookId} 
          setBookData={setBookData}
          setUserDetails={setUserDetails}
        />


        <ScrollView 
          className={`flex-1 ${isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'}`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        >
          <PublishedSection
            bookData={bookData}
            setBookData={setBookData}
            editPost={editPost}
            setEditPost={setEditPost}
            id={bookId}
          />
        </ScrollView>

        {!editPost && (
           <SafeAreaView className={`flex-0 ${isDarkTheme ? 'bg-zinc-800' : 'bg-white'} mx-2`}>
              <View className={`${isDarkTheme ? 'bg-zinc-800' : 'bg-white'}  w-full bottom-0 fixed`}>
                  <View className="flex-row w-full space-x-2">
                      <TouchableOpacity
                        onPress={() => setEditPost(!editPost)}
                        className="flex-1 items-center rounded-lg bg-black py-2"
                      >
                        <Text className="text-white font-bold">Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("NewPublishedChapter", {bookId})}
                        className="flex-1 items-center rounded-lg bg-black py-2"   
                      >
                        <Text className="text-white font-bold">New Post</Text>
                      </TouchableOpacity>
                  </View>
              </View>
            </SafeAreaView>
        )}

        <View className={`flex-0 ${isDarkTheme ? 'bg-zinc-800' : 'bg-white'} `} />
    </View>
  )
}

export default SinglePublishedScreen