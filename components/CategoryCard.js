import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const CategoryCard = ({imgUrl, theme, selected, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} className={`relative mr-2 ${selected ? 'scale-110': ''}`}>
      <Image 
        source={{
          uri: imgUrl
        }} 
        className="h-14 w-24 rounded"
      />
      <Text className={`absolute bottom-1 left-1 font-extrabold ${selected ? 'text-black': 'text-white'}`}>{theme}</Text>
    </TouchableOpacity>
  )
}

export default CategoryCard