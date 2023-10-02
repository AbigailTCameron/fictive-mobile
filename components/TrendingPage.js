import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const TrendingPage = ({trending}) => {

  const navigation = useNavigation();

  const handleBookClick = (bookId, bookTitle, image) => {
    navigation.navigate("Book", {
      bookId,
      bookTitle,
      image
    });
  }

  return (
    <ScrollView className="flex-1 w-full">
          <View className="w-full flex-row">
              {trending.slice(0, 3).map((post) => (
                  <TouchableOpacity
                    onPress={() => handleBookClick(post.id, post.bookTitle, post.image_url)}
                    key={post.id}
                    className="flex-1"
                  >
                    
                    <Image
                      source={post.image_url ? { uri: post.image_url } : require('../assets/no-cover.png')}
                      className="w-30 h-48"
                      resizeMode="cover"
                    />
                        
                  </TouchableOpacity>
              ))}
          </View>   

          <View className="flex-row w-full">
                {trending.slice(3, 4).map((post) => (
                    <TouchableOpacity
                      onPress={() => handleBookClick(post.id, post.bookTitle, post.image_url)}
                      key={post.id}
                    >
                      
                      <Image
                        source={post.image_url ? { uri: post.image_url } : require('../assets/no-cover.png')}
                        className="w-72 h-96"
                        resizeMode="cover"
                      />
                          
                    </TouchableOpacity>
                ))}
                <View> 
                    {trending.slice(4, 6).map((post) => (
                        <TouchableOpacity
                          onPress={() => handleBookClick(post.id, post.bookTitle, post.image_url)}
                          key={post.id}
                
                        >
                          
                          <Image
                            source={post.image_url ? { uri: post.image_url } : require('../assets/no-cover.png')}
                            className="w-40 h-48"
                            resizeMode="cover"
                          />

                        </TouchableOpacity>
                    ))}
                </View>

          </View>

          <View className="w-full flex-row">

              <View> 
                    {trending.slice(6, 8).map((post) => (
                        <TouchableOpacity
                          onPress={() => handleBookClick(post.id, post.bookTitle, post.image_url)}
                          key={post.id}
                
                        >
                          
                          <Image
                            source={post.image_url ? { uri: post.image_url } : require('../assets/no-cover.png')}
                            className="w-40 h-48"
                            resizeMode="cover"
                          />

                        </TouchableOpacity>
                    ))}
                </View>

                {trending.slice(8, 9).map((post) => (
                    <TouchableOpacity
                      onPress={() => handleBookClick(post.id, post.bookTitle, post.image_url)}
                      key={post.id}
            
                    >
                      
                      <Image
                        source={post.image_url ? { uri: post.image_url } : require('../assets/no-cover.png')}
                        className="w-72 h-96"
                        resizeMode="cover"
                      />
                          
                    </TouchableOpacity>
                ))}
                
          </View>

    </ScrollView>
  )
}

export default TrendingPage