import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const SearchResults = ({results, userDetails}) => {
  const navigation = useNavigation();

  const handleUserClick = (username) => {
    navigation.navigate("User", {
      username
    })
  }

  const handleBookClick = (bookId, bookTitle, image, userDetails) => {
    navigation.navigate("Book", {
      bookId,
      bookTitle,
      image,
      userDetails
    })
  }

  return (
    <View className="w-full h-full">
      {results.map((result) => (
          <View className="flex flex-col w-full" key={result.id}>
              {result.collectionType === "books" ? (
                <Pressable 
                  onPress={() => handleBookClick(result.id, result.bookTitle, result.image_url, userDetails)}
                  className="flex-row w-full space-x-2 rounded-xl px-2 py-1"
                >
                    {result.image_url ? (
                      <Image 
                      source={{
                        uri: result.image_url
                      }} 
                        className="w-10 h-18 rounded-xl" 
                      />
                    ) : (
                      <Image 
                        source={require('../assets/logo.png')} 
                        className="w-10 h-18 rounded-xl" 
                      />
                    )}
                    <View>
                      <Text className="font-semibold">{result.bookTitle}</Text>
                      <Text className="text-xs text-gray-500">{result.author}</Text>
                    </View>
                </Pressable>
              ) : (
                <Pressable 
                  onPress={() => handleUserClick(result.username)}
                  className="flex-row w-full space-x-2 rounded-xl px-2 py-1">
                  {result.profilePictureURL ? (
                    <Image 
                      source={{
                        uri: result.profilePictureURL
                      }} 
                      className="w-8 h-8 rounded-full" 
                    />
                  ) : (
                    <Image 
                      source={require('../assets/tiuser.png')} 
                      className="w-8 h-8 rounded-full" 
                    />
                  )}

                  <View>
                    <View className="flex-row space-x-1">
                      <Text>{result.firstName}</Text>
                      <Text>{result.lastName}</Text>
                    </View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">{result.username}</Text>
                  </View>

                </Pressable>
              )}
          </View>
      ))}
    </View>
  )
}

export default SearchResults