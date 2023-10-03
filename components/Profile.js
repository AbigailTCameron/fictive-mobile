import { View, Text, Image, Appearance } from 'react-native'
import React from 'react'

const Profile = ({user, userDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  return (
    <View className={`${isDarkTheme ? 'bg-black' : 'bg-white '} border-b border-slate-200 p-2`}>
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
            <Text className={`font-medium text-base ${isDarkTheme ? 'text-white' : 'text-black'}`}>{userDetails.published.length} published</Text>
            <Text className={`font-medium text-base ${isDarkTheme ? 'text-white' : 'text-black'}`}>{userDetails.following.length} following</Text>
        </View>
      </View>

      <View className="mt-2">
          <Text className={`font-bold text-base ${isDarkTheme ? 'text-white' : 'text-black'}`}>{userDetails.firstName} {userDetails.lastName}</Text>
          <Text className={`font-medium text-sm ${isDarkTheme ? 'text-white' : 'text-black'}`}>@{userDetails.username}</Text>
      </View>
        
     
    </View>
  )
}

export default Profile