import { View, Text, KeyboardAvoidingView, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Appearance } from 'react-native'
import React, { useState } from 'react'
import DeleteDraft from '../modals/DeleteDraft';
import { handleDeleteChapterPublished, handleReEditPost, handleRePublish } from '../queries/fetchUserDetails';
import { useNavigation } from '@react-navigation/native';
import ConfirmPublish from '../modals/ConfirmPublish';

const EditPublishedChapter = ({draftInfo, publishedId, chapterId}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation();

  const [chapterTitle, setChapterTitle] = useState(draftInfo.chapterTitle || '');
  const [storyContent, setStoryContent] = useState(draftInfo.content || '');

  const [showWarning, setShowWarning] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (draftInfo === null || draftInfo === undefined) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleDelete = () => { 
    handleDeleteChapterPublished(publishedId, chapterId, navigation);
    setShowDeleteConfirm(false);
  }

  const handleSaveClick = async() => {
    let chapterTitleTrimmed = chapterTitle.trim();
    let storyContentTrimmed = storyContent.trim();
    
    if(!chapterTitleTrimmed || !storyContentTrimmed){
      setShowWarning(true); 
    }else {
      setShowWarning(false);
      await handleReEditPost(publishedId, chapterId, chapterTitleTrimmed, storyContentTrimmed, navigation); 
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
      handleRePublish(chapterTitle, storyContent, publishedId, chapterId, navigation);
      setShowConfirm(false);
    }else{
      console.log('Please fill out all fields before publish.');
    }
  }



  return (
    <KeyboardAvoidingView className="m-2" style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
       
        <View>
            <TextInput
              className={`${isDarkTheme ? 'bg-zinc-600 text-white' : 'bg-white text-black'}  px-4 py-2 rounded-md text-[14px]`}
              placeholder="Chapter Title..."
              placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
              value={chapterTitle}
              onChangeText={(text) => {
                setChapterTitle(text);
                if (showWarning) {
                  setShowWarning(false);
                }
              }}
            />

            {showWarning && (
              <View className="items-center text-center mt-1">
                <Text className="text-red-500 font-bold">You need content and a chapter title!!!</Text>
              </View>
            )}
        </View>
        <ScrollView className="flex-grow-1">
              <TextInput
                className={`p-2 flex-1 h-screen ${isDarkTheme ? 'text-white' : 'text-black'} rounded-md text-[14px]`}
                placeholder="Write your story here..."
                placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                value={storyContent}
                onChangeText={(text) => {
                  setStoryContent(text);
                  if (showWarning) {
                    setShowWarning(false);
                  }
                }}
                multiline
              />
        </ScrollView>

        {showDeleteConfirm && (
          <DeleteDraft 
            bookTitle={chapterTitle} 
            onClose={() => setShowDeleteConfirm(false)} 
            onConfirm={handleDelete} 
          />
        )}

        {showConfirm && (
            <ConfirmPublish 
              onClose={() => setShowConfirm(false)}
              onConfirm={handleConfirm}
              bookTitle={chapterTitle}
            />
        )}

        <SafeAreaView className="flex-row mx-2">
            <View className="flex-row items-center justify-center flex-1 space-x-2">
                <View className="flex-row w-2/3 space-x-1">
                      <TouchableOpacity className="flex-1 bg-black items-center rounded-md py-2"  onPress={handleSaveClick}>
                        <Text className="text-white font-bold">Save as draft</Text>
                      </TouchableOpacity>

                      <TouchableOpacity className="flex-1 bg-black items-center rounded-md py-2"  onPress={handlePublishClick}>
                        <Text className="text-white font-bold">Publish</Text>
                      </TouchableOpacity>
                </View>
             
                <View className="flex-row w-1/3 justify-end">
                   <TouchableOpacity className="w-3/4 bg-red-500 items-center rounded-md py-2" onPress={() => setShowDeleteConfirm(true)}>
                      <Text className="text-white font-bold">Delete</Text>
                   </TouchableOpacity>
                </View>
               

            </View>
        </SafeAreaView>


    </KeyboardAvoidingView>
  )
}

export default EditPublishedChapter