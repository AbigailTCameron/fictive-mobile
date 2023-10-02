import { View, Text, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'

const NewPublishedChapter = ({chapterTitle, setChapterTitle, storyContent, setStoryContent, showWarning, setShowWarning}) => {

  return (
    <View className="h-full m-2">
        <View className="space-y-1">
            <TextInput 
                className="bg-white px-4 py-2 border text-black border-slate-300 rounded-md text-sm"
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
              <View className="flex items-center justify-center mt-2">
                <Text className="text-red-500 font-semibold">You need content and a chapter title!!!</Text>
              </View>
            )}
        </View>
     
        <ScrollView className="flex-1">
            <TextInput
                className="h-full p-2 outline-none"
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


    </View>
  )
}

export default NewPublishedChapter