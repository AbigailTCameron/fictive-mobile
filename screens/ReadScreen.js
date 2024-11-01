import { View, ScrollView, SafeAreaView, Appearance, Pressable } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { fetchBook, fetchComments } from '../components/queries/fetchUserDetails';
import BookLoading from './loading/BookLoading';
import LoadingPage from './loading/LoadingPage';
import StoryHeader from '../components/headers/StoryHeader';
import BookContent from '../components/book/BookContent';
import StoryFooter from '../components/footers/StoryFooter';
import PullUpMenu from '../components/comment/PullUpMenu';

const ReadScreen = ({user, userDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [bookData, setBookData] = useState(null);

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  const [comments, setComments] = useState([]);
  const [batchSize, setBatchSize] = useState(10); 
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const [showHeader, setShowHeader] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); 

  const {
    params: {
      bookId,
      bookTitle,
      image
    }
  } = useRoute(); 

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    }) 
  }, [])

  useEffect(() => {
    if(bookId){
      fetchBook(setLoading, bookId, setBookData);
    }
  }, [bookId]);

  useEffect(() => {
    if(bookData){
      fetchComments(setLoading, bookId, bookData.chapters[currentChapterIndex].id, setComments, batchSize, setHasMoreComments); 
    }
  }, [bookId, bookData, batchSize, currentChapterIndex])

  const hideHeaderAfterDelay = () => {
    setTimeout(() => {
      setHeaderVisible(false);
    }, 3000); 
  };

  useEffect(() => {
    if (headerVisible) {
      hideHeaderAfterDelay();
    }
  }, [headerVisible]);

  const handleNextChapter = () => {
    if (currentChapterIndex < bookData.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const showHeaderForFewSeconds = () => {
    setShowHeader(true);

    setTimeout(() => {
      setShowHeader(false);
    }, 3000);
  };

  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
  }

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  }


  if (loading && image) {
    return (
      <BookLoading imageUrl={image}/>
    );
  }else if(loading && !image){
    return (
      <LoadingPage />
    )
  }

  return (
    <View className={`flex-1 ${isDarkTheme ? 'bg-black' : ''}`}>
          <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-gray-100'}`}/>


          <SafeAreaView className={`flex-0 z-50 ${isDarkTheme ? 'bg-black' : 'bg-gray-100'}`}>
                {showHeader && (
                  <StoryHeader 
                    bookTitle={bookTitle} 
                    chapterTitle={bookData.chapters[currentChapterIndex].chapterTitle}
                  />

                )}
          </SafeAreaView>


          <ScrollView className="flex-1">
            <Pressable 
              className="flex-1"
              onPress={showHeaderForFewSeconds}
            >    
                <BookContent 
                  chapter={currentChapterIndex} 
                  chapterTitle={bookData.chapters[currentChapterIndex].chapterTitle} 
                  content={bookData.chapters[currentChapterIndex].content}
                />
            </Pressable>
          </ScrollView>

          <SafeAreaView className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-gray-100'}`}>
                <StoryFooter 
                  commentsLength={comments.length} 
                  currentChapterIndex={currentChapterIndex} 
                  bookLength={bookData.chapters.length}
                  handleNextChapter={handleNextChapter}
                  handlePreviousChapter={handlePreviousChapter}
                  handleToggleMenu={handleOpenBottomSheet}
                />
          </SafeAreaView>

          {isBottomSheetOpen && (
            <PullUpMenu
              user={user}
              isBottomSheetOpen={isBottomSheetOpen}
              handleCloseBottomSheet={handleCloseBottomSheet}
              userDetails={userDetails}
              comments={comments}
              setBatchSize={setBatchSize}
              hasMoreComments={hasMoreComments}
              bookId={bookId}
              chapterId={bookData.chapters[currentChapterIndex].id}
            />
          )}     

          <View className={`flex-0 ${isDarkTheme ? 'bg-black' : ''}`}/>

    </View>

   
  )
}

export default ReadScreen