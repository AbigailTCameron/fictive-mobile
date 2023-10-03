import { View, Text, TouchableOpacity, Image, Appearance } from 'react-native'
import React, { useState } from 'react';
import {PlusCircleIcon} from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import LoginModal from '../modals/LoginModal';


const Published = ({user, userDetails, published}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation(); 
  const [loginWindow, setLoginWindow] = useState(false);

  const handleClickPublished = (bookId) => {
    navigation.navigate("SpecificPublished", {
      bookId
    })
  }

  return (
    <View>
      {userDetails.published.length < 1 ? (
        <View className="h-full w-full items-center justify-center">

          <TouchableOpacity 
             onPress={() => {
              if(user){
                navigation.navigate("Create");
              }else{
                setLoginWindow(true);
              }
            }}
            className={`items-center ${isDarkTheme ? 'bg-black' : 'bg-white'}  p-8 rounded-xl shadow-md drop-shadow-2xl`}
          >
              <PlusCircleIcon size={80} color={`${isDarkTheme ? 'white' : '#0058f7'}`}/>
              <Text className={`font-semibold text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>Create your first story</Text>
          </TouchableOpacity>
            
        </View>

      ):(
        <View className="mx-3 my-1 space-y-2">
          {published.map((book) => (
            <TouchableOpacity
            onPress={() => handleClickPublished(book.id)} 
            key={book.id} 
            className={`${isDarkTheme ? 'bg-zinc-900' : 'bg-white'}  rounded-xl py-4 px-4 shadow-sm flex-row space-x-4`}
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
                      source={require('../../assets/no-cover.png')}
                      className="w-32 h-48 rounded-lg border-[1px]"
                    />
                )}

                <View className="space-y-1 flex-1">
                    <Text className={`text-lg font-bold ${isDarkTheme ? 'text-white' : 'text-[#0059f7]'} `}>{book.data().bookTitle}</Text>
                    <Text className={`${isDarkTheme ? 'text-white': 'text-black'}`}>{book.data().author}</Text>

                    <View className="flex-row w-full max-w-full flex-wrap space-x-1">
                        {book.data().tags.map((tag, index) => (
                            <View key={index}  style={{marginVertical: 2}} className="border-2 rounded-md border-[#eaeaea]">
                              <Text className={`p-1 text-sm font-semibold ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-500'}`}>{tag}</Text>
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

      {loginWindow && (
        <LoginModal 
          onClose={() => setLoginWindow(false)}
        />
      )}
    </View>
  )
}

export default Published