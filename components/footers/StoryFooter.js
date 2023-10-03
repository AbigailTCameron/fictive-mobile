import { View, Text, TouchableOpacity, Appearance } from 'react-native';
import {ChevronLeftIcon, ChevronRightIcon} from 'react-native-heroicons/outline';
import {ChatBubbleLeftRightIcon} from 'react-native-heroicons/solid';

import React from 'react'

const StoryFooter = ({commentsLength, currentChapterIndex, bookLength, handleNextChapter, handlePreviousChapter, handleToggleMenu}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  return (
    <View className={`flex-row w-full bottom-0 items-center justify-center fixed space-x-10`}>
      <TouchableOpacity 
        onPress={handlePreviousChapter}
        className={`flex-row items-center`}
        disabled={currentChapterIndex === 0}
      >
          <ChevronLeftIcon size={18} color={`${currentChapterIndex === 0 ? `${isDarkTheme ? '#374151' : '#a1a1aa'}` : `${isDarkTheme ? 'white' : 'black'}`}`}/>
          <Text className={`${currentChapterIndex === 0 ? `${isDarkTheme ? 'text-gray-700' : 'text-gray-400'}` : `${isDarkTheme ? 'text-white' : 'text-black'}`}`}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleNextChapter}
        className={`flex-row items-center`}
        disabled={currentChapterIndex === bookLength - 1}
      >
          <Text className={`${currentChapterIndex === bookLength - 1 ? `${isDarkTheme ? 'text-gray-700' : 'text-gray-400'}` : `${isDarkTheme ? 'text-white' : 'text-black'}`}`}>Next</Text>
          <ChevronRightIcon size={18} color={`${currentChapterIndex === bookLength - 1 ? `${isDarkTheme ? '#374151' : '#a1a1aa'}` : `${isDarkTheme ? 'white' : 'black'}`}`}/>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleToggleMenu}
        className="flex-row absolute right-8 items-center"
      >
        <Text className={`font-bold ${isDarkTheme ? 'text-white' : 'text-black'}`}>{commentsLength}</Text>
        <ChatBubbleLeftRightIcon size={30} color={'#0058f7'}/>
      </TouchableOpacity>


    </View>
  )
}

export default StoryFooter