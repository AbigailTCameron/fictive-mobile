import { View, Text, TextInput, Appearance, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { saveAsDraft } from '../queries/fetchUserDetails';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';


const NewStoryHeader = () => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation({user}); 

  const [chapterTitle, setChapterTitle] = useState(''); 
  const [bookTitle, setBookTitle] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imageWarning, setImageWarning] = useState(false); 

  const [storyContent, setStoryContent] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);



  const handleSaveDraft = async() => {
    if(!bookTitle || !chapterTitle){
      setShowWarning(true); 
    }else {
      setShowWarning(false); 
      await saveAsDraft(imageFile, user, chapterTitle, storyContent, bookTitle, navigation);
    }
  }

  const handlePublishClick = () => {
    if (!bookTitle || !chapterTitle || !storyContent || !imageFile) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      setShowConfirm(true); 
    }
  };

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
        setImageFile(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting profile picture:', error);
    }
  };

  return (
    <View className="flex-row flex-1 space-x-2 p-2 border-b border-[#ccc]">

    <View className="flex-1">
        <View className="flex-1 space-y-1">
              <TextInput
                className={`outline-none ${isDarkTheme ? 'bg-zinc-700 text-white' : 'bg-white border-slate-300 text-black'} px-4 py-2 border  rounded-md text-sm`}
                placeholder="Book Title..."
                value={bookTitle}
                onChangeText={(text) => {
                  setBookTitle(text);
                  if (showWarning) {
                    setShowWarning(false);
                  }
                }}
              />
              <TextInput
                className={`outline-none ${isDarkTheme ? 'bg-zinc-700 text-white' : 'bg-white border-slate-300 text-black'} px-4 py-2 border  rounded-md text-sm`}
                placeholder="Chapter Title"
                value={chapterTitle}
                onChangeText={(text) => {
                  setChapterTitle(text);
                  if (showWarning) {
                    setShowWarning(false);
                  }
                }}
              />

            <View className="flex-row pt-2 space-x-2">
                  <TouchableOpacity
                    onPress={handleSaveDraft}
                    className={`flex-1 items-center rounded-lg ${isDarkTheme ? 'bg-white' : 'bg-black border-2 border-white'}  py-2`}
                  >
                    <Text className={`${isDarkTheme ? 'text-black' : 'text-white'} font-bold`}>Save as draft</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handlePublishClick}
                    className={`flex-1 items-center rounded-lg ${isDarkTheme ? 'bg-white' : 'bg-black border-2 border-white'}  py-2`}
                  >
                    <Text className={`${isDarkTheme ? 'text-black' : 'text-white'} font-bold`}>Publish</Text>
                  </TouchableOpacity>
            </View>

            {showWarning && (
              <View className="flex items-center justify-center mt-2">
                <Text className="text-red-500 font-semibold">You need content, a cover, book and chapter title!!!</Text>
              </View>
            )}

            {imageWarning && (
              <View className="flex items-center justify-center mt-2">
                <Text className="text-red-500 font-semibold">Please select a valid image file!!!</Text>
              </View>
            )}

        </View>
    </View>

    <TouchableOpacity onPress={handleImageChange}>
        {imageFile ? (
          <Image
            className="flex-1 border-[1px] rounded-xl"
            source={{ uri: imageFile }}
            style={{ width: 100, height: 100}}
          />
        ) : (
      
            <Image
              className="flex-1 border-[1px] rounded-xl"
              source={require('../assets/add-cover.png')}
              style={{ width: 100, height: 100 }}
            />
        )}
    </TouchableOpacity>


    {showConfirm && (
      <ConfirmPublish
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        bookTitle={bookTitle}
      />
    )}

    </View>

  )
}

export default NewStoryHeader