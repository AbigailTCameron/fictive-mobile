import { View, Text, TouchableOpacity, ScrollView, TextInput, Appearance } from 'react-native'
import React, { useState } from 'react'
import { formatTimestamp } from '../queries/format';
import { handleSaveSynopsis, handleSaveTags } from '../queries/fetchUserDetails';
import { useNavigation } from '@react-navigation/native';


const DraftSection = ({draftId, draftData, userDetails, setDraftData, editPost, setEditPost}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation();

  const [tagInput, setTagInput] = useState('');
  const [synopsisInput, setSynopsisInput] = useState(draftData.synopsis || '');


  if (draftData === null || draftData === undefined) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleRemoveTag = async(tag) => {
    await handleSaveTags(userDetails, draftId, tag);

    const updatedDraftData = { ...draftData, tags: draftData.tags.filter((t) => t !== tag) };
    setDraftData(updatedDraftData);
  };

  const handleAddTag = async() => {
    if (tagInput.trim() !== '') {
      await handleSaveTags(userDetails, draftId, tagInput);
      
      // Update the bookData with the new tag after adding it to the books collection
      const updatedTags = [...draftData.tags, tagInput.toLowerCase()];
      const updatedDraftData = { ...draftData, tags: updatedTags };
      setDraftData(updatedDraftData);

      setTagInput('');
    }
  };

  const handleEditDraft = (draftId, chapterId) => {
    navigation.navigate("EditDraft", {
      draftId,
      chapterId
    })
  }


  return (
    <ScrollView className="m-2">

        <Text className={`font-medium mb-1 ${isDarkTheme ? 'text-white' : 'text-black'}`}>Themes:</Text>
        <View className="flex-row space-x-1">

          {draftData.tags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row bg-[#0058f7] self-start px-3 py-1 rounded-lg"
              onPress={() => editPost && handleRemoveTag(tag)}
            >
                <Text className="text-white font-bold">{tag}</Text>
            </TouchableOpacity>
              
          ))}

        </View>

        {editPost && (
          <View >
              <TextInput
                className={`${isDarkTheme ? 'text-white bg-zinc-600 border-zinc-600' : 'text-black'}  p-2 rounded-md my-1 border flex-1`}
                placeholder="Enter a theme..."
                placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                value={tagInput}
                onChangeText={(text) => setTagInput(text)}
              />
              <TouchableOpacity
                onPress={handleAddTag}
                className="w-1/2 items-center rounded-lg bg-black py-2"
              >
                <Text className="text-white font-bold">Save Tag</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="mt-4">
            {editPost ? (
              <View className="flex-1 w-full">
                <TextInput
                  className={`${isDarkTheme ? 'text-white bg-zinc-600 border-zinc-600' : 'text-black'}  p-2 rounded-md my-1 border flex-1`}
                  multiline
                  value={synopsisInput}
                  onChangeText={(text) => setSynopsisInput(text)}
                  placeholder="Click edit & write synopsis here..."
                  placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                />

                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => handleSaveSynopsis(userDetails, draftId, synopsisInput, setSynopsisInput, setEditPost)}
                    className="flex-1 items-center rounded-lg bg-black py-2"
                  >
                    <Text className="text-white font-bold">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEditPost(false)}
                    className="flex-1 items-center rounded-lg bg-red-500 py-2"
                  >
                    <Text className="text-white font-bold">Cancel</Text>
                  </TouchableOpacity>
                </View>

              </View>
            ) : (
              <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>{synopsisInput || 'Click edit to write synopsis and add themes...'}</Text>
            )}
        </View>

        <View className="my-6" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
            <View className="flex-row border-b border-slate-300">
              <View className="flex-1">
                <Text className={`${isDarkTheme ? 'text-white' : 'text-slate-600'}  font-bold py-1`}>Chapters</Text>
              </View>
              <View className="flex-1">
                <Text className={`${isDarkTheme ? 'text-white' : 'text-slate-600'}  font-bold py-1`}>Status</Text>
              </View>
              <View className="flex-1">
                <Text className={`${isDarkTheme ? 'text-white' : 'text-slate-600'}  font-bold py-1`}>Date</Text>
              </View>
            </View>


            {draftData.chapters.map((item) => (
              <TouchableOpacity
                onPress={() => handleEditDraft(draftId, item.id)}
                key={item.id}
                className="flex-row border-b border-slate-200"
              >
                    <View className="flex-1 py-2">
                      <Text className="text-[#0058f7] font-bold" >{item.chapterTitle}</Text>
                    </View>
                    <View className="flex-1 py-2">
                      <Text className={`${isDarkTheme ? 'text-white' : 'text-slate-600'} font-medium`} >draft</Text>
                    </View>
                    <View className="flex-1 py-2">
                      <Text className={`${isDarkTheme ? 'text-white' : 'text-slate-600'}  font-medium`}>{formatTimestamp(item.timestamp)}</Text>
                    </View>
              </TouchableOpacity>
            ))}
        </View>

    </ScrollView>
  )
}

export default DraftSection