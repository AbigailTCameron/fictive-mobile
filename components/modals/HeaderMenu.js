import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Image, Appearance } from 'react-native'
import React from 'react';
import {Cog8ToothIcon, DocumentDuplicateIcon, ArrowLeftOnRectangleIcon, UserCircleIcon} from 'react-native-heroicons/mini';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../functions';


const HeaderMenu = ({onClose, userDetails}) => {
  const colorScheme = Appearance.getColorScheme();
  const isDarkTheme = colorScheme === 'dark';

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

          <View className={`flex-1 items-center justify-center ${isDarkTheme ? 'bg-zinc-800/[0.9]' : 'bg-black/[0.3]'}`}>
              <View className={`${isDarkTheme ? 'bg-zinc-700' : 'bg-slate-100'} rounded-xl shadow-xl w-3/4 p-2`}>
                  <View className={`${isDarkTheme ? 'bg-zinc-900' : 'bg-white'} rounded-xl w-full space-y-2`}>

                        <View className={`items-center ${isDarkTheme ? 'bg-zinc-950' : 'bg-[#0059f7] border-[#eaeaea]'}  rounded-t-xl border-b py-4`}>
                            {userDetails && userDetails.profilePictureURL ? (
                              <Image 
                                  source={{
                                    uri: userDetails.profilePictureURL
                                  }} 
                                  className="w-32 h-32 rounded-full"
                              />
                            ) : (
                              <Image 
                                source={require('../../assets/tiuser1.png')} 
                                className="w-32 h-32 rounded-full"
                              />
                            )}
                            
                            <Text className="font-bold text-xl mt-2 text-white">{userDetails.firstName} {userDetails.lastName}</Text>
                    
                        </View>

                        <View className="p-4 space-y-4">
                              <TouchableOpacity 
                                onPress={() => {
                                  navigation.navigate("Profile");
                                  closeModal();
                                }}
                                className="flex-row items-center space-x-2 p-2">
                                  <UserCircleIcon size={26} color={`${isDarkTheme ? 'white' : 'black'}`}/>
                                  <Text className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                                    Profile
                                  </Text>
                              </TouchableOpacity>

                              <TouchableOpacity 
                                onPress={() => {
                                  navigation.navigate("Drafts");
                                  closeModal();
                                }}
                                className="flex-row items-center space-x-2 p-2">
                                  <DocumentDuplicateIcon size={26} color={`${isDarkTheme ? 'white' : 'black'}`}/>
                                  <Text className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                                    Drafts
                                  </Text>
                              </TouchableOpacity>

                              <TouchableOpacity 
                                onPress={() => {
                                  navigation.navigate("Settings");
                                  closeModal();
                                }}
                                className="flex-row items-center space-x-2 p-2">
                                  <Cog8ToothIcon size={26} color={`${isDarkTheme ? 'white' : 'black'}`}/>
                                  <Text className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                                    Settings
                                  </Text>
                              </TouchableOpacity>

                              <TouchableOpacity 
                                onPress={async() => {
                                  await logout();
                                  navigation.navigate("Home")
                                }}
                                className="flex-row items-center space-x-2 p-2">
                                  <ArrowLeftOnRectangleIcon size={26} color={`${isDarkTheme ? 'white' : 'black'}`}/>
                                  <Text className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
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