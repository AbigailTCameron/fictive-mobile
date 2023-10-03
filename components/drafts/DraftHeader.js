import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import { formatTimestamp } from '../queries/format';
import { handleDeleteDraft, handlePublish, handleSaveTitle, uploadBookCover } from '../queries/fetchUserDetails';
import DeleteDraft from '../modals/DeleteDraft';
import { useNavigation } from '@react-navigation/native';
import ConfirmPublish from '../modals/ConfirmPublish';
import * as ImagePicker from 'expo-image-picker';


const DraftHeader = ({draftId, userDetails, draftData, setDraftData, editPost, setEditPost}) => {
  const navigation = useNavigation();

  const [newTitle, setNewTitle] = useState(draftData.bookTitle || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveDraftTitle = async() => {
    const updatedDraftsData = await handleSaveTitle(userDetails.uid, draftId, newTitle, draftData);
    setDraftData(updatedDraftsData);

    setEditPost(false);
  }

  const handleConfirm = () => { 
    handlePublish(userDetails, draftId, navigation);
    setShowConfirm(false);
  }

  const handleDelete = () => { 
    handleDeleteDraft(userDetails, draftId, navigation);
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
    <View className="flex-row bg-[#0058f7] p-2">

        {editPost ? (
          <View className="flex-1 py-4">

              <TextInput 
                className="bg-white px-4 py-2 border text-black border-slate-300 rounded-md text-[14px]"
                onChangeText={(text) => setNewTitle(text)}
                value={newTitle}
                placeholder='Book Title...'
              />
              
              <View className="flex-row py-1 space-x-2">
                  <TouchableOpacity
                    onPress={handleSaveDraftTitle}
                    className="flex-1 items-center rounded-lg bg-black py-2"
                  >
                    <Text className="text-white font-bold">Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setEditPost(false)}
                    className="flex-1 items-center rounded-lg bg-white py-2"
                  >
                    <Text className="text-red-500 font-bold">Cancel</Text>
                  </TouchableOpacity>
              </View>

          </View>
        ) : (
          <View className="flex-row flex-1 space-x-4">
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

                  <View className="flex-row pt-2 space-x-2">
                      <TouchableOpacity
                        onPress={() => setShowConfirm(true)}
                        className="flex-1 items-center rounded-lg bg-black py-2"
                      >
                        <Text className="text-white font-bold">Publish</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setShowDeleteConfirm(true)}
                        className="flex-1 items-center bg-white rounded-lg py-2"
                      >
                        <Text className="text-red-500 font-bold">Delete</Text>
                      </TouchableOpacity>
                  </View>
              </View>

              <TouchableOpacity onPress={handleImageChange}>
                    {draftData.image_url ? (
                      <Image
                        className="flex-1 border-[1px] rounded-xl"
                        source={{ uri: draftData.image_url }}
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
        )}
        
        {showDeleteConfirm && (
          <DeleteDraft 
            onClose={() => setShowDeleteConfirm(false)}
            bookTitle={draftData.bookTitle}
            onConfirm={handleDelete}
          />
        )}

        {showConfirm && (
          <ConfirmPublish
            bookTitle={draftData.bookTitle}
            onClose={() => setShowConfirm(false)}
            onConfirm={handleConfirm}
          />
        )}

    </View>
  )
}

export default DraftHeader