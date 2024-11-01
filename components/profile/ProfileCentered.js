import { View, Text, Image, TouchableOpacity, Appearance } from 'react-native'
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfilePicture } from '../queries/fetchUserDetails';


const ProfileCentered = ({user, userDetails, setUserDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

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
        uploadProfilePicture(result, userDetails.uid, userDetails, setUserDetails);
      }
    } catch (error) {
      console.error('Error selecting profile picture:', error);
    }
  };


  return (
    <View className={`h-full w-full flex-1 justify-center items-center ${isDarkTheme ? 'bg-black' : 'bg-white'}  space-y-10`}>

          <View className="items-center -mt-20 space-y-2">
                <Text className={`${isDarkTheme ? 'text-white' : 'text-black'} font-extrabold text-3xl`}>{userDetails.firstName} {userDetails.lastName}</Text>
                <Text className={`${isDarkTheme ? 'text-white' : 'text-black'} font-medium text-xl`}>@{userDetails.username}</Text>
          </View>
       
          <TouchableOpacity onPress={handleImageChange}>
              {user && userDetails.profilePictureURL ? (
                <Image 
                  source={{
                    uri: userDetails.profilePictureURL
                  }}
                  className="w-80 h-80 rounded-full" 
                />
              ) : (
                <Image 
                  source={require("../../assets/tiuser.png")}
                  className="w-72 h-72 rounded-full" 
                />
              
              )}
          </TouchableOpacity>
           
    </View>
  )
}

export default ProfileCentered