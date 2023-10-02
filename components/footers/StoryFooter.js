import { View, Text, TouchableOpacity } from 'react-native';
import {ChevronLeftIcon, ChevronRightIcon} from 'react-native-heroicons/outline';
import {ChatBubbleLeftRightIcon} from 'react-native-heroicons/solid';

import React from 'react'

const StoryFooter = ({commentsLength, currentChapterIndex, bookLength, handleNextChapter, handlePreviousChapter, handleToggleMenu}) => {
  return (
    <View className={`flex-row w-full bottom-0 items-center justify-center fixed space-x-10`}>
      <TouchableOpacity 
        onPress={handlePreviousChapter}
        className={`flex-row items-center`}
        disabled={currentChapterIndex === 0}
      >
          <ChevronLeftIcon size={18} color={`${currentChapterIndex === 0 ? '#a1a1aa' : 'black'}`}/>
          <Text className={`${currentChapterIndex === 0 ? 'text-gray-400' : 'text-black'}`}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleNextChapter}
        className={`flex-row items-center`}
        disabled={currentChapterIndex === bookLength - 1}
      >
          <Text className={`${currentChapterIndex === bookLength - 1 ? 'text-gray-400' : 'text-black'}`}>Next</Text>
          <ChevronRightIcon size={18} color={`${currentChapterIndex === bookLength - 1 ? '#a1a1aa' : 'black'}`}/>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleToggleMenu}
        className="flex-row absolute right-8 items-center"
      >
        <Text className="font-bold">{commentsLength}</Text>
        <ChatBubbleLeftRightIcon size={30} color="#0058f7"/>
      </TouchableOpacity>


    </View>
  )
}

export default StoryFooter