import { View, Text, TextInput, ScrollView, Appearance } from 'react-native'
import React, { useState } from 'react'

const NewPublishedChapter = ({chapterTitle, setChapterTitle, storyContent, setStoryContent, showWarning, setShowWarning}) => {

  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';


  return (
    <View className="h-full m-2">
        <View className="space-y-1">
            <TextInput 
                className={`${isDarkTheme ? 'bg-zinc-600 text-white' : 'bg-white text-black'}  px-4 py-2 rounded-md text-sm`}
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
     
        <ScrollView className="flex-1">
            <TextInput
                className={`p-2 flex-1 h-screen ${isDarkTheme ? 'text-white' : 'text-black '} rounded-md text-[14px]`}
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


    </View>
  )
}

export default NewPublishedChapter