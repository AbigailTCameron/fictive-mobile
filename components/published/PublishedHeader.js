import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { formatTimestamp } from '../queries/format'
import DeleteDraft from '../modals/DeleteDraft';
import { handleDeletePublished, updatePublishedBookCover } from '../queries/fetchUserDetails';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const PublishedHeader = ({userDetails, bookData, bookId, setBookData, setUserDetails}) => {
  const navigation = useNavigation();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => { 
    handleDeletePublished(bookId, userDetails, navigation, setUserDetails);
    setShowDeleteConfirm(false);
  }

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

  return (
    <View className="flex-row bg-[#0058f7] p-2">
         <View className="flex-row flex-1 space-x-4">
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

                  <View className="flex-row pt-2 space-x-2">
                      <TouchableOpacity
                        onPress={() => setShowDeleteConfirm(true)}
                        className="flex-1 items-center bg-white rounded-lg py-2"
                      >
                        <Text className="text-red-500 font-bold">Delete</Text>
                      </TouchableOpacity>
                  </View>
              </View>

              <TouchableOpacity onPress={handleImageChange}>
                    {bookData.image_url ? (
                      <Image
                        className="flex-1 border border-black rounded-xl"
                        source={{ uri: bookData.image_url }}
                        style={{ width: 100, height: 100}}
                      />
                    ) : (
                  
                        <Image
                          className="flex-1 border border-black rounded-xl"
                          source={require('../../assets/no-cover.png')}
                          style={{ width: 100, height: 100 }}
                        />
                    )}
              </TouchableOpacity>
          </View>

        {showDeleteConfirm && (
          <DeleteDraft 
            onClose={() => setShowDeleteConfirm(false)}
            bookTitle={bookData.bookTitle}
            onConfirm={handleDelete}
          />
        )}

    </View>
  )
}

export default PublishedHeader