import { View, SafeAreaView, Appearance } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import { fetchDraft } from '../components/queries/fetchUserDetails';
import LoadingPage from './loading/LoadingPage';
import EditDraftHeader from '../components/drafts/EditDraftHeader';
import EditDraftChapter from '../components/drafts/EditDraftChapter';

const EditDraftScreen = ({user, userDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation();

  const [loading, setLoading] = useState(true); 
  const [draftData, setDraftData] = useState(null);
  const [draftInfo, setDraftInfo] = useState(null);

  const {
    params: {
      draftId,
      chapterId
    }
  } = useRoute(); 

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []); 

  useEffect(() => {
    fetchDraft(setLoading, userDetails.uid, draftId, setDraftData, setDraftInfo, chapterId);
  }, [draftId, chapterId]);


  if(loading || draftInfo === null || draftInfo === undefined){
    return(
      <LoadingPage />
    )
  }
  

  return (
    <View className={`flex-1 ${isDarkTheme ? 'bg-zinc-800' : ''}`}>
        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-[#0059f7]'}`}/>

        <SafeAreaView className={`flex-0 z-50 ${isDarkTheme ? 'bg-black' : 'bg-[#0058f7]'}`}>
          <HomeHeader user={user} userDetails={userDetails} />
        </SafeAreaView>

        <View className="flex-1">

            <EditDraftHeader 
              draftData={draftData} 
              setDraftData={setDraftData} 
              draftId={draftId} 
              userDetails={userDetails}
            />

            <EditDraftChapter 
              draftInfo={draftInfo}
              userDetails={userDetails}
              draftId={draftId}
              chapterId={chapterId}
            />
        </View>

        <View className={`flex-0 ${isDarkTheme ? 'bg-zinc-800' : 'bg-white'} `}/>
    </View>
  )
}

export default EditDraftScreen