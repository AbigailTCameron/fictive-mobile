import { View, Text, Image } from 'react-native'
import React from 'react'

const BookLoading = ({imageUrl}) => {
  return (
    <View className="bg-black w-full h-full items-center justify-center">
      <Image 
        source={{
          uri: imageUrl
        }}
        className="w-5/6 h-4/6 rounded-xl"
      />
    </View>
  )
}

export default BookLoading