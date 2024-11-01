import { View, Text, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Appearance } from 'react-native'
import React, { useState } from 'react'
import { handleAddNewChapter } from '../queries/fetchUserDetails';
import { useNavigation } from '@react-navigation/native';
import TextEditor from '../TextEditor';

const NewDraftChapter = ({draftId, userDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark'; 

  const navigation = useNavigation();

  const [chapterTitle, setChapterTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');

  const [showWarning, setShowWarning] = useState(false);


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

  return (
    <KeyboardAvoidingView className="m-2" style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <View>
            <TextInput 
                className={`${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white text-black  border-slate-300 '}  px-4 py-2 border rounded-md text-sm`}
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
         
        <View className="flex-1">
          <TextEditor 
              storyContent={storyContent}
              setStoryContent={setStoryContent}
              showWarning={showWarning}
              setShowWarning={setShowWarning}
          />
        
        </View>

        <SafeAreaView className="flex-row mx-4">
              <View className="flex-row items-center justify-center flex-1 space-x-2">
                  <TouchableOpacity 
                    onPress={handleSaveClick}
                    className="flex-1 bg-black items-center rounded-md py-2"  
                  >
                    <Text className="text-white font-bold">Save as draft</Text>
                  </TouchableOpacity>
              </View>
          </SafeAreaView>


    </KeyboardAvoidingView>
  )
}

export default NewDraftChapter