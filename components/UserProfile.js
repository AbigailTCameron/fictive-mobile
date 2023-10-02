import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { handleToggleFollowList } from './queries/fetchUserDetails';
import LoginModal from './modals/LoginModal';

const UserProfile = ({userData, userDetails, setUserDetails}) => {
  const [following, setFollowing] = useState([]); 
  const [loginWindow, setLoginWindow] = useState(false);

  useEffect(() => {
    if(userDetails){
      setFollowing(userDetails.following); 
    }
  }, [userDetails])


  return (
    <View className="bg-white border-b border-slate-200 p-2">

      <View className="flex-row items-center space-x-4">
            {userData.profilePictureURL ? (
              <Image 
                  source={{
                    uri: userData.profilePictureURL
                  }}
                  className="w-24 h-24 rounded-full"
              />
              
              ) : (
                <Image 
                  source={require(`../assets/tiuser.png`)}
                  className="w-24 h-24 rounded-full"
                />
              )} 

            <View className="space-y-2">
                <Text className="font-medium text-base">{userData.published.length} published</Text>
                <Text className="font-medium text-base">{userData.following.length} following</Text>
            </View>

      </View>
      
      <View className="flex-row w-full justify-between">
          <View>
              <View className="flex-row space-x-1 mt-2">
                <Text className="font-bold text-base">{userData.firstName}</Text>
                <Text className="font-bold text-base">{userData.lastName}</Text>
              </View>
            
              <Text className="font-medium text-sm">@{userData.username}</Text>
          </View>
          
          
          <TouchableOpacity
            onPress={() => {
              if(userDetails){
                handleToggleFollowList(setFollowing, userDetails, setUserDetails, userData.username)
              }else{
                setLoginWindow(true);
              }
            }}
            className="bg-black rounded-xl px-4 py-2 items-end self-end"
          >
              {following.includes(userData.username) ? (
                <Text className="text-white font-medium">unfollow</Text>
              ): (
                <Text className="text-white font-medium">follow</Text>
              )}
          
          </TouchableOpacity>  
      </View>
     


      {loginWindow && (
        <LoginModal 
          onClose={() => setLoginWindow(false)}
        />
      )}
   

    </View>
  )
}

export default UserProfile