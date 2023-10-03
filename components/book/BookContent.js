import { View, Text, Appearance } from 'react-native'
import React from 'react'

const BookContent = ({content, chapter, chapterTitle}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  return (
    <View className="mx-2 text-justify">
        <View className="items-center justify-center mt-20 mb-10">
          <Text className={`text-xl font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>{chapter + 1}</Text>
          <Text className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-black'}`}>{chapterTitle}</Text>
        </View>
      
      <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>{content}</Text>
    </View>
  )
}

export default BookContent