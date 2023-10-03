import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { formatTimestamp } from '../queries/format'
import * as ImagePicker from 'expo-image-picker';
import { updatePublishedBookCover } from '../queries/fetchUserDetails';

const EditPublishedHeader = ({userDetails, bookData, bookId, setBookData}) => {
  const [imageWarning, setImageWarning] = useState(false); 

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access media library was denied');
      }
    })();
  }, []);

  const handleImageChange = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission to access camera roll is required!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], 
        quality: 0.2
      });

      if (!result.canceled) {
        updatePublishedBookCover(result, bookData, userDetails.uid, bookId, setBookData);
      }
    } catch (error) {
      console.error('Error selecting profile picture:', error);
    }
  };


  if (bookData === null || bookData === undefined) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-row bg-[#0058f7] space-x-4 p-2">
        <View className="flex-1">
      
            <View className="flex-row space-x-2 items-center my-1">
              <Text className="text-white font-extrabold text-xl">{bookData.bookTitle}</Text>
              <Text className="text-white">•</Text>
              <Text className="text-white">{bookData.chapters.length} chapters</Text>
            </View>
      
            <View className="flex-row items-center space-x-2">
                  {userDetails.profilePictureURL ? (
                        <Image
                          source={{
                            uri: userDetails.profilePictureURL
                          }} 
                        className="w-20 h-20 rounded-full" 
                      
                      />
                      ) : (
                        <Image
                          source={require('../../assets/tiuser1.png')}
                          className="w-20 h-20 rounded-full" 
                        />
                    )}
                  
                  <View>
                      <Text className="text-white font-bold">@{userDetails.username}</Text>
                      <Text className="text-white text-xs font-light">{formatTimestamp(bookData.publishedAt)}</Text>
                  </View>

                  <View className="flex-row space-x-1">
                      <Text className="text-white">•</Text>
                      <Text className="text-white">{bookData.readCount} Views</Text>
                  </View>
            </View>

            {imageWarning && (
              <View className="flex items-center justify-center mt-2">
                <Text className="text-red-500 font-semibold">Please select a valid image file!!!</Text>
              </View>
            )}
        
        </View>

        <TouchableOpacity onPress={handleImageChange}>
              {bookData.image_url ? (
                <Image
                  className="flex-1 border-[1px] rounded-xl"
                  source={{ uri: bookData.image_url }}
                  style={{ width: 100, height: 100}}
                />
              ) : (
            
                  <Image
                    className="flex-1 border-[1px] rounded-xl"
                    source={require('../../assets/no-cover.png')}
                    style={{ width: 100, height: 100 }}
                  />
              )}
        </TouchableOpacity>

    </View>
  )
}

export default EditPublishedHeader