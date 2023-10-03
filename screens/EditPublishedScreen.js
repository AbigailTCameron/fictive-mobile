import { View, SafeAreaView, Appearance } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import EditPublishedHeader from '../components/published/EditPublishedHeader';
import { fetchBookAndDraft } from '../components/queries/fetchUserDetails';
import LoadingPage from './loading/LoadingPage';
import EditPublishedChapter from '../components/published/EditPublishedChapter';

const EditPublishedScreen = ({user, userDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation(); 

  const [loading, setLoading] = useState(true);
  const [bookData, setBookData] = useState(null);

  const [draftInfo, setDraftInfo] = useState(null);


  const {
    params: {
      publishedId,
      chapterId
    }
  } = useRoute(); 

  useLayoutEffect(()  => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []);

  useEffect(() => {
    fetchBookAndDraft(setLoading, publishedId, chapterId, setDraftInfo, setBookData);
  }, [chapterId, publishedId])


  if(loading || draftInfo === null || draftInfo === undefined){
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


        <View className="flex-1">
            <EditPublishedHeader 
              userDetails={userDetails} 
              bookData={bookData}
              setBookData={setBookData}  
              bookId={publishedId}
            />

            <EditPublishedChapter 
              draftInfo={draftInfo}
              publishedId={publishedId}
              chapterId={chapterId}
            />
        </View>

        <View className={`flex-0 ${isDarkTheme ? 'bg-zinc-800' : 'bg-white'} `}/>
    </View>
  )
}

export default EditPublishedScreen