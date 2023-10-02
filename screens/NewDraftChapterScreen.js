import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import HomeHeader from '../components/headers/HomeHeader'
import { useNavigation, useRoute } from '@react-navigation/native';
import EditDraftHeader from '../components/drafts/EditDraftHeader';
import { fetchPublishedDraft, handleAddNewChapter } from '../components/queries/fetchUserDetails';
import LoadingPage from './loading/LoadingPage';
import NewDraftChapter from '../components/drafts/NewDraftChapter';

const NewDraftChapterScreen = ({user, userDetails}) => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true); 
  const [draftData, setDraftData] = useState(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [showWarning, setShowWarning] = useState(false);


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

  const handleSaveClick = async() => {
    let chapterTitleTrimmed = chapterTitle.trim();
    let storyContentTrimmed = storyContent.trim();
    if (!chapterTitleTrimmed || !storyContentTrimmed) {
      setShowWarning(true);
    }else {
      setShowWarning(false);
      await handleAddNewChapter(chapterTitleTrimmed, storyContentTrimmed, userDetails.uid, draftId, navigation);
    }
  }

  useEffect(() => {
    fetchPublishedDraft(setLoading, userDetails.uid, draftId, setDraftData);
  }, [userDetails, draftId])


  return (
    <View className="flex-1">
       <View className="flex-0 bg-[#0059f7]"/>

        <SafeAreaView className="flex-0 z-50 bg-[#0058f7]">
          <HomeHeader user={user} userDetails={userDetails}/>
        </SafeAreaView>

        <EditDraftHeader 
          draftData={draftData} 
          userDetails={userDetails}
          setDraftData={setDraftData}
          draftId={draftId}
        />

        <ScrollView className="flex-1">
          <NewDraftChapter 
            chapterTitle={chapterTitle}
            setChapterTitle={setChapterTitle}
            storyContent={storyContent}
            setStoryContent={setStoryContent}
            showWarning={showWarning}
            setShowWarning={setShowWarning}
          />
        </ScrollView>

        <SafeAreaView className="flex-0">
            <View className={`w-full bottom-0 fixed`}>
                <View className="flex-row w-full justify-evenly px-10">
                    <TouchableOpacity
                      onPress={handleSaveClick}
                      className="flex-1 items-center rounded-lg bg-black py-2"
                    >
                      <Text className="text-white font-bold">Save as draft</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>


        <View className="flex-0 bg-white"/>

    </View>
  )
}

export default NewDraftChapterScreen