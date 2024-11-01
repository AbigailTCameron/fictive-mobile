import { View, Text, TextInput, ScrollView, Appearance, SafeAreaView, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import TextEditor from '../TextEditor';

const NewPublishedChapter = ({chapterTitle, setChapterTitle, storyContent, setStoryContent, showWarning, setShowWarning, handleSaveDraft, handlePublishClick}) => {

  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';


  return (
    <KeyboardAvoidingView className="m-2" style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <View>
            <TextInput 
                className={`${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white border-slate-300 text-black'}  px-4 py-2 border rounded-md text-[14px]`}
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
              <View className="flex items-center justify-center mt-2">
                <Text className="text-red-500 font-semibold">You need content and a chapter title!!!</Text>
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
                  <TouchableOpacity className="flex-1 bg-black items-center rounded-md py-2"  onPress={handleSaveDraft}>
                    <Text className="text-white font-bold">Save as draft</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-1 bg-black items-center rounded-md py-2" onPress={handlePublishClick}>
                    <Text className="text-white font-bold">Publish</Text>
                  </TouchableOpacity>

              </View>
        </SafeAreaView>


    </KeyboardAvoidingView>
  )
}

export default NewPublishedChapter