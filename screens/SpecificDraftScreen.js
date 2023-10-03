import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Appearance, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import HomeHeader from '../components/headers/HomeHeader';
import { fetchPublishedDraft } from '../components/queries/fetchUserDetails';
import DraftHeader from '../components/drafts/DraftHeader';
import LoadingPage from './loading/LoadingPage';
import DraftSection from '../components/drafts/DraftSection';

function SpecificDraft({user, userDetails}) {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const [draftData, setDraftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editPost, setEditPost] = useState(false); 
  const [refreshing, setRefreshing] = useState(false);


  const navigation = useNavigation();
  
  const {
    params: {
      draftId
    }
  } = useRoute(); 

  const fetchDraftData = useCallback(async () => {
    try {
      await fetchPublishedDraft(setLoading, userDetails.uid, draftId, setDraftData);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }, [userDetails, draftId]);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []); 

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    fetchDraftData()
    .then(() => {
      setRefreshing(false);
    })
    .catch((error) => {
      console.log("Error refreshing data:", error);
      setRefreshing(false); 
    })

  }, [fetchDraftData])

  useFocusEffect(
    useCallback(() => {
      fetchDraftData();
    }, [fetchDraftData])
  );

  if(loading || draftData === null || draftData === undefined){
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

        <DraftHeader 
            draftId={draftId} 
            userDetails={userDetails}
            draftData={draftData}
            setDraftData={setDraftData}
            editPost={editPost}
            setEditPost={setEditPost}
          />


        <ScrollView
          className={`flex-1 ${isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'}`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        >
        
          <DraftSection 
            userDetails={userDetails}
            draftId={draftId}
            setDraftData={setDraftData}
            draftData={draftData} 
            editPost={editPost} 
            setEditPost={setEditPost}
          />
        </ScrollView>

        {!editPost && (
           <SafeAreaView className={`flex-0 ${isDarkTheme ? 'bg-zinc-800' : 'bg-white'}  mx-2`}>
              <View className={`${isDarkTheme ? 'bg-zinc-800' : 'bg-white'}  w-full bottom-0 fixed`}>
                  <View className="flex-row w-full space-x-2">
                      <TouchableOpacity
                        onPress={() => setEditPost(!editPost)}
                        className={`flex-1 items-center rounded-lg ${isDarkTheme ? 'bg-white' : 'bg-black '}  py-2`}
                      >
                        <Text className={`${isDarkTheme ? 'text-black' : 'text-white'}  font-bold`}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("NewDraftChapter", {draftId})}
                        className={`flex-1 items-center rounded-lg ${isDarkTheme ? 'bg-white' : 'bg-black '}  py-2`} 
                      >
                        <Text className={`${isDarkTheme ? 'text-black' : 'text-white'}  font-bold`}>New Post</Text>
                      </TouchableOpacity>
                  </View>
              </View>
            </SafeAreaView>
        )}
       
      <View className={`flex-0 ${isDarkTheme ? 'bg-zinc-800' : 'bg-white'} `}/>
    </View>
  )
}

export default SpecificDraft