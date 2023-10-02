import { View, Text, Image } from 'react-native'
import React from 'react'

const Profile = ({user, userDetails}) => {
  return (
    <View className="bg-white border-b border-slate-200 p-2">
      <View className="flex-row items-center space-x-4">
        {user && userDetails.profilePictureURL ? (
          <Image 
            source={{
              uri: userDetails.profilePictureURL
            }}
            className="w-28 h-28 rounded-full" 
          />
        ) : (
          <Image 
            source={require("../assets/tiuser.png")}
            className="w-28 h-28 rounded-full" 
          />
        
        )}

        <View>
            <Text className="font-medium text-base">{userDetails.published.length} published</Text>
            <Text className="font-medium text-base">{userDetails.following.length} following</Text>
        </View>
      </View>

        <View className="mt-2">
            <Text className="font-bold text-base">{userDetails.firstName} {userDetails.lastName}</Text>
            <Text className="font-medium text-sm">@{userDetails.username}</Text>
        </View>
        
     



 
    </View>
  )
}

export default Profile