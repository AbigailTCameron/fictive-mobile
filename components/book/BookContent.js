import { View, Text } from 'react-native'
import React from 'react'

const BookContent = ({content, chapter, chapterTitle}) => {
  return (
    <View className="mx-2 text-justify">
        <View className="items-center justify-center mt-20 mb-10">
          <Text className="text-xl font-semibold">{chapter + 1}</Text>
          <Text className="text-2xl font-bold">{chapterTitle}</Text>
        </View>
      
      <Text>{content}</Text>
    </View>
  )
}

export default BookContent