import { View, Text, Image, Pressable, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react';
import {StarIcon} from 'react-native-heroicons/solid';
import LoginModal from './modals/LoginModal';
import { useNavigation } from '@react-navigation/native';
import RatingModal from './modals/RatingModal';
import { handleToggleReadingList } from './queries/fetchUserDetails';


const Posts = ({user, setUserDetails, posts, userDetails, selectedTheme, hasMoreBooks, setBatchSize}) => {
  const navigation = useNavigation();

  const [readingList, setReadingList] = useState([]);

  const [selectedBookId, setSelectedBookId] = useState(null);
  const [ratingModal, setRatingModal] = useState(false);

  const [loginWindow, setLoginWindow] = useState(false);


  const handleBookClick = (bookId, bookTitle, image) => {
    navigation.navigate("Book", {
      bookId,
      bookTitle,
      image
    });
  }

  const handleLoadMore = () => {
    setBatchSize((prevBatchSize) => prevBatchSize + 10);
  };
   

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {posts.filter((post) => selectedTheme === null || post.data().tags.includes(selectedTheme))
      .map((post, index) => (
        <View key={index} className="mx-3 my-1">
            <TouchableOpacity 
              onPress={() => handleBookClick(post.id, post.data().bookTitle, post.data().image_url)}
              className="w-full flex bg-white rounded-xl dark:bg-zinc-900 shadow-sm dark:text-white py-4 px-4"
              key={post.id}
            >
                <View className="flex-row space-x-4">
                    {post.data().image_url ? (
                        <Image 
                          source={{
                            uri: post.data().image_url 
                          }} 
                          className="w-20 h-32 rounded-lg"
                        />
                    ) : (
                        <Image 
                          source={require('../assets/no-cover.png')} 
                          className="w-20 h-32 rounded-lg"
                        />
                    )}

                    <View className="flex-1">
                        <Text className='text-xl font-semibold'>{post.data().bookTitle}</Text>
                        <Text className='text-lg'>{post.data().author}</Text>

                        <View className="flex-row w-full space-x-1">
                            {post.data().tags.map((tag, index) => (
                                <View key={index} className="border border-[#eaeaea] rounded-md">
                                  <Text 
                                    className="p-1 text-sm font-semibold text-zinc-500"
                                  >{tag}
                                  </Text>
                                </View>
                            ))}
                        </View>

                        <Pressable className="flex-row self-start items-center w-fit mt-2 space-x-1"
                          onPress={() => {
                            if(user){
                              setSelectedBookId(post.id);
                              setRatingModal(true);
                            }else{
                              setLoginWindow(true);
                            }
                          }}
                        >
                                <Text className="font-bold text-zinc-500">{post.data().rating.toFixed(2)}</Text>
                                <StarIcon size={20} />
                        </Pressable>

                        {ratingModal && selectedBookId === post.id && (
                          <RatingModal 
                            onClose={() => setRatingModal(false)}
                            bookTitle={post.data().bookTitle}
                            bookId={post.id}
                            userId={userDetails.uid}
                          />
                        )}

                        
                       
                      <View className="w-full overflow-hidden">
                        <Text 
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{
                            fontSize: 14,
                            lineHeight: 20, 
                          }}
                        >
                          {post.data().synopsis}
                        </Text>
                      </View>
                         
                    </View>

                </View>
                
                <View className="flex-row items-center w-full justify-end">
                      <TouchableOpacity 
                        onPress={() => {
                          if(user){
                            handleToggleReadingList(user, post.id, setReadingList, userDetails, setUserDetails);
                          }else {
                            setLoginWindow(true);
                          }
                        }}
                        className="bg-[#0058f7] p-1 rounded-lg text-xs font-bold"
                        >
                          {readingList.includes(post.id) ? (
                            <Text className="text-white font-bold">remove from list</Text>
                          ): (
                            <Text className="text-white font-bold">add to list</Text>
                          )}
                      </TouchableOpacity>
                      
                </View>
                
            </TouchableOpacity>
          
        </View>
      ))}

      {loginWindow && (
        <LoginModal
          onClose={() => setLoginWindow(false)}
        />
      )}

      {hasMoreBooks && (
        <Pressable className="items-center text-center" onPress={handleLoadMore}>
          <Text className='text-base font-semibold mt-4'>
            Load more...
          </Text>
        </Pressable>
      )}
    </ScrollView>
  )
}

export default Posts