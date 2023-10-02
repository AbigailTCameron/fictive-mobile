import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native'
import React from 'react';
import {Cog8ToothIcon, DocumentDuplicateIcon, ArrowLeftOnRectangleIcon, UserCircleIcon} from 'react-native-heroicons/mini';
import { useNavigation } from '@react-navigation/native';
import { handleLogout } from '../queries/fetchUserDetails';
import { logout } from '../../functions';


const HeaderMenu = ({onClose, userDetails}) => {

  const navigation = useNavigation(); 

  const closeModal = () => {
    onClose();
  };


  return (
    <Modal
      transparent={true} 
      animationType="fade" 
      visible={true} 
      onRequestClose={closeModal}
    >

      <TouchableWithoutFeedback onPress={closeModal}>

      <View className="flex-1 items-center justify-center bg-black/[0.3]">
          <View className="bg-slate-100 rounded-xl shadow-xl w-3/4 p-2">
              <View className="bg-white rounded-xl w-full space-y-2">

                    <View className="items-center bg-[#0059f7] rounded-t-xl border-b border-[#eaeaea] py-4">
                        {userDetails && userDetails.profilePictureURL ? (
                          <Image 
                              source={{
                                uri: userDetails.profilePictureURL
                              }} 
                              className="w-20 h-20 rounded-full"
                          />
                        ) : (
                          <Image 
                            source={require('../../assets/tiuser1.png')} 
                            className="w-20 h-20 rounded-full"
                          />
                        )}
                        
                        <Text className="font-semibold text-base mt-2 text-white">{userDetails.firstName} {userDetails.lastName}</Text>
                
                    </View>

                    <View className="p-4 space-y-4">


                          <TouchableOpacity 
                            onPress={() => {
                              navigation.navigate("Profile");
                              closeModal();
                            }}
                            className="flex-row items-center space-x-2">
                              <UserCircleIcon size={26} color='black'/>
                              <Text className="text-lg font-medium">
                                Profile
                              </Text>
                          </TouchableOpacity>

                          <TouchableOpacity 
                             onPress={() => {
                              navigation.navigate("Drafts");
                              closeModal();
                            }}
                            className="flex-row items-center space-x-2">
                              <DocumentDuplicateIcon size={26} color='black'/>
                              <Text className="text-lg font-medium">
                                Drafts
                              </Text>
                          </TouchableOpacity>

                          <TouchableOpacity 
                            onPress={() => {
                              navigation.navigate("Settings");
                              closeModal();
                            }}
                            className="flex-row items-center space-x-2">
                              <Cog8ToothIcon size={26} color='black'/>
                              <Text className="text-lg font-medium">
                                Settings
                              </Text>
                          </TouchableOpacity>

                          <TouchableOpacity 
                            onPress={async() => {
                              await logout();
                              navigation.navigate("Home")
                            }}
                            className="flex-row items-center space-x-2">
                              <ArrowLeftOnRectangleIcon size={26} color='black'/>
                              <Text className="text-lg font-medium">
                                Sign out
                              </Text>
                          </TouchableOpacity>
                    </View>

                  
              </View>
          </View>
      </View>
      </TouchableWithoutFeedback>

    </Modal>
  )
}

export default HeaderMenu