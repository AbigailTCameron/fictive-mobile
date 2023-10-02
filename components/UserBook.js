import { View, Text, RefreshControl, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchPublished } from './queries/fetchUserDetails';
import { useNavigation } from '@react-navigation/native';

const UserBook = ({userData, userDetails}) => {
  const navigation = useNavigation();

  const [published, setPublished] = useState([]);
  const [refreshing, setRefreshing] = useState(true);


  useEffect(() => {
    fetchPublished(setRefreshing, userData, setPublished)
  }, [userData]);


  const onRefresh = useCallback(() => {
    setRefreshing(true);

    fetchPublished(setRefreshing, userData, setPublished)
    .then(() => {
      setRefreshing(false);
    })
    .catch((error) => {
      console.log("Error refreshing data:", error);
      setRefreshing(false); 
    })

  }, [userData])

  const handleBookClick = (bookId, bookTitle, image, userDetails) => {
    navigation.navigate("Book", {
      bookId,
      bookTitle,
      image,
      userDetails
    });
  }


  return (
    <View refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
      {userData.published.length < 1 ? (
        <View className="items-center justify-center w-full h-full">
            <Text>This user has not posted anything yet.</Text>
        </View>
      ) : (
          <View className="mx-3 my-1">

            {published.map((book) => (
              <TouchableOpacity 
                onPress={() => handleBookClick(book.id, book.data().bookTitle, book.data().image_url, userDetails)}
                className="bg-white rounded-xl py-4 px-4 shadow-sm flex-row space-x-4"
                key={book.id}
              >
                 {book.data().image_url ? (
                    <Image 
                      source={{
                        uri: book.data().image_url
                      }}
                      className="w-32 h-48 rounded-lg"
                    />
                   
                ) : (
                    <Image 
                      source={require('../assets/no-cover.png')}
                      className="w-32 h-48 rounded-lg"
                    />
                   
                )}
                
                <View className="space-y-1 flex-1">
                    <Text className="text-lg font-bold text-[#0059f7]">{book.data().bookTitle}</Text>
                    <Text>{book.data().author}</Text>

                    <View className="flex-row w-full space-x-1">
                        {book.data().tags.map((tag, index) => (
                            <View key={index} className="border-2 rounded-md border-[#eaeaea]">
                              <Text className="p-1 text-sm font-semibold text-zinc-500">{tag}</Text>
                            </View>
                        ))}

                    </View>
                    <View className="w-full overflow-hidden">
                      <Text 
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={{
                          fontSize: 14,
                          lineHeight: 20, 
                        }}
                      >{book.data().synopsis}
                      </Text>
                    </View>
                    

                </View>

              </TouchableOpacity>
            ))}
          </View>
      )}
    </View>
  )
}

export default UserBook