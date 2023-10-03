import { View, Text, SafeAreaView, Appearance } from 'react-native'
import React from 'react'

const StoryHeader = ({bookTitle, chapterTitle}) => {

  return (
    <View className={`items-center justify-center w-full z-10 flex`}>
      
        <Text className={`text-xl font-semibold text-gray-500`}>{bookTitle}</Text>
        <Text className="text-gray-400">{chapterTitle}</Text>
      
    </View>
  )
}

export default StoryHeader