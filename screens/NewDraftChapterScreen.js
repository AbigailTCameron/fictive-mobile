import { View, SafeAreaView, Appearance } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import HomeHeader from '../components/headers/HomeHeader'
import { useNavigation, useRoute } from '@react-navigation/native';
import EditDraftHeader from '../components/drafts/EditDraftHeader';
import { fetchPublishedDraft } from '../components/queries/fetchUserDetails';
import LoadingPage from './loading/LoadingPage';
import NewDraftChapter from '../components/drafts/NewDraftChapter';

const NewDraftChapterScreen = ({user, userDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation();

  const [loading, setLoading] = useState(true); 
  const [draftData, setDraftData] = useState(null);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []);   

  const {
    params: {
      draftId
    }
  } = useRoute(); 

  useEffect(() => {
    fetchPublishedDraft(setLoading, userDetails.uid, draftId, setDraftData);
  }, [userDetails, draftId])

  if(loading){
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

        <EditDraftHeader 
          draftData={draftData} 
          userDetails={userDetails}
          setDraftData={setDraftData}
          draftId={draftId}
        />

        <View className="flex-1">
          <NewDraftChapter 
            draftId={draftId}
            userDetails={userDetails}
          />
        </View>


        <View className={`flex-0 ${isDarkTheme ? 'bg-zinc-800' : 'bg-white'} `}/>

    </View>
  )
}

export default NewDraftChapterScreen