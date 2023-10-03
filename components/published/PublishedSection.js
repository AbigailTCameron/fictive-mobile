import { View, Text, ScrollView, TouchableOpacity, TextInput, Appearance } from 'react-native'
import React, { useState } from 'react'
import { handleSavePublishedSynopsis, handleSavePublishedTags } from '../queries/fetchUserDetails';
import { formatTimestamp } from '../queries/format';
import { useNavigation } from '@react-navigation/native';

const PublishedSection = ({bookData, id, setBookData, editPost, setEditPost}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation();

  const [tagInput, setTagInput] = useState('');
  const [synopsisInput, setSynopsisInput] = useState(bookData.synopsis || '');

  const chaptersAndDrafts = [...bookData.chapters, ...bookData.drafts.map(item => ({ ...item, fromDrafts: true }))];

  const handleRemoveTag = async (tag) => {
    await handleSavePublishedTags(id, tag);

    // Update the bookData with the updated tags after tag removal
    const updatedBookData = { ...bookData, tags: bookData.tags.filter((t) => t !== tag) };
    setBookData(updatedBookData);
  }

  const handleAddTag = async() => {
    if (tagInput.trim() !== '') {
      await handleSavePublishedTags(id, tagInput); 

      // Update the bookData with the new tag after adding it to the books collection
      const updatedTags = [...bookData.tags, tagInput.toLowerCase()];
      const updatedBookData = { ...bookData, tags: updatedTags };
      setBookData(updatedBookData);

      setTagInput('');
    }
  };

  const handleEditPublished = (publishedId, chapterId) => {
    navigation.navigate("EditPublished", {
      publishedId,
      chapterId
    })
  }


  return (
    <ScrollView className="m-2">

        <Text className={`font-medium mb-1 ${isDarkTheme ? 'text-white' : 'text-black'}`}>Themes:</Text>
        <View className="flex-row space-x-1">

          {bookData.tags.map((tag, index) => (
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
                  placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                  placeholder="Click edit & write synopsis here..."
                />

                <View className="flex-row space-x-2">
                    <TouchableOpacity
                      onPress={() => handleSavePublishedSynopsis(id, synopsisInput, setSynopsisInput, setEditPost)}
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


            {chaptersAndDrafts.map((item) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.fromDrafts) {
                    handleEditPublished(id, item.id);
                  }
                }}
                key={item.id}
                className="flex-row border-b border-slate-200"
              >
                    <View className="flex-1 py-2">
                      <Text className={`font-bold ${item.fromDrafts ? 'text-[#0058f7]' : 'text-slate-600 cursor-not-allowed'}`} >{item.chapterTitle}</Text>
                    </View>
                    <View className="flex-1 py-2">
                      <Text className={`${isDarkTheme ? 'text-white' : 'text-slate-600'} font-medium`} >{item.fromDrafts ? "drafts" : "published"}</Text>
                    </View>
                    <View className="flex-1 py-2">
                      <Text className={`${isDarkTheme ? 'text-white' : 'text-slate-600'} font-medium`}>{formatTimestamp(item.timestamp)}</Text>
                    </View>
              </TouchableOpacity>
            ))}
        </View>

    </ScrollView>
  )
}

export default PublishedSection