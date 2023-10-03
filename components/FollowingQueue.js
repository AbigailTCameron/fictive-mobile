import { View, Text, Image, TouchableOpacity, Appearance } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const FollowingQueue = ({followingList}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation();

  const handleUserClick = (username) => {
    navigation.navigate("User", {
      username
    })
  }


  return (
    <View>

      <View className="mx-3 my-1 space-y-2">

         {followingList.map((user) => (
            <TouchableOpacity 
              onPress={() => handleUserClick(user.username)}
              key={user.id} 
              className={`${isDarkTheme ? 'bg-zinc-900' : 'bg-white'} rounded-xl py-4 px-4 shadow-sm flex-row space-x-4`}
            >

                  {user.profilePictureURL ? (
                    <Image
                      source={{
                        uri: user.profilePictureURL
                      }}
                      className="w-10 h-10 rounded-full" 
                    />
                  ) : (
                    <Image
                      source={require('../assets/tiuser.png')}
                      className="w-10 h-10 rounded-full" 
                    />
                  )}
                <View className="flex-1 space-y-1">
                  <Text className={`text-base font-bold ${isDarkTheme ? 'text-white' : 'text-[#0059f7]'} `}>{user.firstName} {user.lastName}</Text>
                  <Text className={`font-medium ${isDarkTheme ? 'text-white' : 'text-black'}`}>@{user.username}</Text>
                </View>
                 
            </TouchableOpacity>
          ))}
      </View>
    </View>
  )
}

export default FollowingQueue