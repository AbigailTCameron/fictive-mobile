import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Appearance } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import EditPublishedHeader from '../components/published/EditPublishedHeader';
import { fetchBook, handleChapterPublish, handleNewPostClick } from '../components/queries/fetchUserDetails';
import NewPublishedChapter from '../components/published/NewPublishedChapter';
import ConfirmPublish from '../components/modals/ConfirmPublish';
import LoadingPage from './loading/LoadingPage';

const NewPublishedChapterScreen = ({user, userDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation(); 

  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false);

  const [chapterTitle, setChapterTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');

  const [showWarning, setShowWarning] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


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

  const fetchPublishedBook = useCallback(async () => {
    try {
      await fetchBook(setLoading, bookId, setBookData);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }, [bookId]);


  const onRefresh = useCallback(() => {
    setRefreshing(true);

    fetchPublishedBook()
    .then(() => {
      setRefreshing(false);
    })
    .catch((error) => {
      console.log("Error refreshing data:", error);
      setRefreshing(false); 
    })

  }, [fetchPublishedBook])

  useFocusEffect(
    useCallback(() => {
      fetchPublishedBook();
    }, [fetchPublishedBook])
  );


  const handleSaveDraft = async() => {
    let chapterTitleTrimmed = chapterTitle.trim();
    let storyContentTrimmed = storyContent.trim();
    
    if(!chapterTitleTrimmed || !storyContentTrimmed){
      setShowWarning(true);
    }else {
      await handleNewPostClick(bookId, chapterTitleTrimmed, storyContentTrimmed, navigation);
      setShowWarning(false);

    }
  }

  const handlePublishClick = async() => {
    let chapterTitleTrimmed = chapterTitle.trim();
    let storyContentTrimmed = storyContent.trim();
    
    if (!chapterTitleTrimmed || !storyContentTrimmed) {
      setShowWarning(true);
    }else {
      setShowWarning(false);
      setShowConfirm(true); 
    }
  }

  const handleConfirm = () => { 
    if(chapterTitle && storyContent){
      handleChapterPublish(chapterTitle, storyContent, bookId, navigation);
      setShowConfirm(false);
    }else{
      console.log('Please fill out all fields before publish.');
    }
  }

  if(loading){
    return(
      <LoadingPage />
    )
  }

  return (
    <View className={`flex-1 ${isDarkTheme ? 'bg-zinc-800' : ''}`}>
        <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-[#0059f7]'}`} />

        <SafeAreaView className={`flex-0 z-50 ${isDarkTheme ? 'bg-black' : 'bg-[#0058f7]'}`}>
            <HomeHeader user={user} userDetails={userDetails}/>
        </SafeAreaView>

        <EditPublishedHeader 
          userDetails={userDetails}
          bookData={bookData}
          setBookData={setBookData}  
          bookId={bookId}
        />

        <ScrollView className="flex-1">
          <NewPublishedChapter 
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
                <View className="flex-row w-full justify-evenly space-x-2 px-4">
                    <TouchableOpacity
                      onPress={handleSaveDraft}
                      className="flex-1 items-center rounded-lg bg-black py-2"
                    >
                      <Text className="text-white font-bold">Save as draft</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handlePublishClick}
                      className="flex-1 items-center rounded-lg bg-black py-2"
                    >
                      <Text className="text-white font-bold">Publish</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>

        <View className={`flex-0 ${isDarkTheme ? 'bg-zinc-800' : 'bg-white'} `}/>

        {showConfirm && (
           <ConfirmPublish
              bookTitle={chapterTitle}
              onClose={() => setShowConfirm(false)}
              onConfirm={handleConfirm}
            />
      )}
    </View>
  )
}

export default NewPublishedChapterScreen