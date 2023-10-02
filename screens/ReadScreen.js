import { View, Text, ScrollView, SafeAreaView, TouchableWithoutFeedback } from 'react-native'
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
    <SafeAreaView className="flex-1">
      <TouchableWithoutFeedback onPress={showHeaderForFewSeconds}>
          <View className="flex-1">
              {showHeader && (
                  <StoryHeader 
                    bookTitle={bookTitle} 
                    chapterTitle={bookData.chapters[currentChapterIndex].chapterTitle}
                  />
              )}

              <ScrollView className="flex-1">
                  <BookContent 
                    chapter={currentChapterIndex} 
                    chapterTitle={bookData.chapters[currentChapterIndex].chapterTitle} 
                    content={bookData.chapters[currentChapterIndex].content}
                  />
              </ScrollView>

            
              <StoryFooter 
                commentsLength={comments.length} 
                currentChapterIndex={currentChapterIndex} 
                bookLength={bookData.chapters.length}
                handleNextChapter={handleNextChapter}
                handlePreviousChapter={handlePreviousChapter}
                handleToggleMenu={handleOpenBottomSheet}
              />

          </View>
      </TouchableWithoutFeedback>

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

    </SafeAreaView>
   
  )
}

export default ReadScreen