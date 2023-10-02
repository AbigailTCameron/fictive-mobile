import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import { deleteChapter, fetchDraft, handleSaveChapterContent } from '../components/queries/fetchUserDetails';
import LoadingPage from './loading/LoadingPage';
import EditDraftHeader from '../components/drafts/EditDraftHeader';
import EditDraftChapter from '../components/drafts/EditDraftChapter';
import DeleteDraft from '../components/modals/DeleteDraft';

const EditDraftScreen = ({user, userDetails}) => {
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
    <View className="flex-1">
        <View className="flex-0 bg-[#0059f7]"/>

        <SafeAreaView className="flex-0 z-50 bg-[#0058f7]">
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

        <View className="flex-0 bg-white"/>
    </View>
  )
}

export default EditDraftScreen