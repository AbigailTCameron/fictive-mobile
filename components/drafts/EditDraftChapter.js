import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView} from 'react-native'
import React, { useState } from 'react'
import { deleteChapter, handleSaveChapterContent } from '../queries/fetchUserDetails';
import { useNavigation } from '@react-navigation/native';
import DeleteDraft from '../modals/DeleteDraft';


const EditDraftChapter = ({draftInfo, userDetails, draftId, chapterId}) => {
  const navigation = useNavigation(); 

  const [chapterTitle, setChapterTitle] = useState(draftInfo.chapterTitle || '');
  const [storyContent, setStoryContent] = useState(draftInfo.content || '');

  const [showWarning, setShowWarning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  if (draftInfo === null || draftInfo === undefined) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleSaveClick = async() => {
    let chapterTitleTrimmed = chapterTitle.trim();
    let storyContentTrimmed = storyContent.trim();

    if (!chapterTitleTrimmed || !storyContentTrimmed) {
      setShowWarning(true);
    }else {
      setShowWarning(false);
      await handleSaveChapterContent(userDetails.uid, draftId, chapterId, chapterTitleTrimmed, storyContentTrimmed, navigation)
    }
  }


  const handleDelete = async() => { 
    setShowDeleteConfirm(false);
    await deleteChapter(userDetails.uid, draftId, chapterId, navigation);
  }



  return (
    <KeyboardAvoidingView className="m-2" style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
       
          <View>
              <TextInput
                className="bg-white px-4 py-2 border text-black border-slate-300 rounded-md text-[14px]"
                placeholder="Chapter Title..."
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
                  className="p-2 flex-1 h-screen text-black rounded-md text-[14px]"
                  placeholder="Write your story here..."
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

          <SafeAreaView className="flex-row mx-4">
              <View className="flex-row items-center justify-center flex-1 space-x-2">
                  <TouchableOpacity className="flex-1 bg-black items-center rounded-md py-2"  onPress={handleSaveClick}>
                    <Text className="text-white font-bold">Save as draft</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-1 bg-red-500 items-center rounded-md py-2" onPress={() => setShowDeleteConfirm(true)}>
                    <Text className="text-white font-bold">Delete</Text>
                  </TouchableOpacity>

              </View>
          </SafeAreaView>


    </KeyboardAvoidingView>
   
  )
}

export default EditDraftChapter