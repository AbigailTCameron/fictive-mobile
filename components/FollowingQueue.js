import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const FollowingQueue = ({followingList}) => {
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
              className="bg-white rounded-xl py-4 px-4 shadow-sm flex-row space-x-4"
            >

                  {user.profilePictureURL ? (
                    <Image
                      source={{
                        uri: user.profilePictureUR
                      }}
                      className="w-24 h-24 sm:w-14 sm:h-14 rounded-full" 
                    />
                  ) : (
                    <Image
                      source={require('../assets/tiuser.png')}
                      className="w-24 h-24 sm:w-14 sm:h-14 rounded-full" 
                    />
                  )}
                <View className="flex-1 space-y-1">
                  <Text className="text-lg font-bold text-[#0059f7]">{user.firstName} {user.lastName}</Text>
                  <Text className="font-medium">@{user.username}</Text>
                </View>
                 
            </TouchableOpacity>
          ))}
      </View>
    </View>
  )
}

export default FollowingQueue