import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'

const ReadingQueue = ({readingList, userDetails}) => {
  const navigation = useNavigation();

  const handleBookClick = (bookId, bookTitle, image, userDetails) => {
    navigation.navigate("Book", {
      bookId,
      bookTitle,
      image,
      userDetails
    });
  }

  return (
    <View>

        <View className="mx-3 my-1 space-y-2">
            {readingList.map((book) => (
              <TouchableOpacity
                onPress={() => handleBookClick(book.id, book.data().bookTitle, book.data().image_url, userDetails)}
                className="bg-white rounded-xl py-4 px-4 shadow-sm flex-row space-x-4"
                key={book.id}
              >

                  {book.data().image_url ? (
                    <Image 
                      source={{
                        uri: book.data().image_url
                      }}
                      className="w-32 h-48 rounded-xl" 
                    />
                    
                  ) : (
                    <Image 
                      source={require('../assets/no-cover.png')}
                      className="w-32 h-48 rounded-xl" 
                    />
                  )}

                  <View className="flex-1 space-y-1">
                      <Text className="text-lg font-bold text-[#0059f7]">{book.data().bookTitle}</Text>
                      <Text className="font-medium">{book.data().author}</Text>

                      <View className="flex-row w-full space-x-1">
                          {book.data().tags.map((tag, index) => (
                              <View key={index} className="border-2 rounded-md border-[#eaeaea]">
                                <Text className="p-1 text-sm font-semibold text-zinc-500">{tag}</Text>
                              </View>
                          ))}
                      </View>
                      
                      <View className="w-full overflow-hidden">
                          <Text 
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={{
                                fontSize: 14,
                                lineHeight: 20, 
                              }}
                            >{book.data().synopsis}
                          </Text>
                      </View>
                     
                  </View>


              </TouchableOpacity>
            ))}
        </View>
      
    </View>
  )
}

export default ReadingQueue