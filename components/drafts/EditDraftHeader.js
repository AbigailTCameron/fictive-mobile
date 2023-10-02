import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { formatTimestamp } from '../queries/format';
import * as ImagePicker from 'expo-image-picker';
import { uploadBookCover } from '../queries/fetchUserDetails';


const EditDraftHeader = ({draftData, userDetails, setDraftData, draftId}) => {
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
        uploadBookCover(result, draftData, draftId, userDetails.uid, setDraftData);
      }
    } catch (error) {
      console.error('Error selecting profile picture:', error);
    }
  };
  
  if (draftData === null || draftData === undefined) {
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
              <Text className="text-white font-extrabold text-xl">{draftData.bookTitle}</Text>
              <Text className="text-white">•</Text>
              <Text className="text-white">{draftData.chapters.length} chapters</Text>
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
                      <Text className="text-white text-xs font-light">{formatTimestamp(draftData.createdAt)}</Text>
                  </View>
            </View>

            {imageWarning && (
              <View className="flex items-center justify-center mt-2">
                <Text className="text-red-500 font-semibold">Please select a valid image file!!!</Text>
              </View>
            )}
         
      </View>

      <TouchableOpacity onPress={handleImageChange}>
            {draftData.image_url ? (
              <Image
                className="flex-1 border border-black rounded-xl"
                source={{ uri: draftData.image_url }}
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
  )
}

export default EditDraftHeader