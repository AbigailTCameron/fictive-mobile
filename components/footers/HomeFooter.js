import { View, Text, TouchableOpacity, Appearance } from 'react-native'
import React, { useState } from 'react'
import {FireIcon, QueueListIcon, BookOpenIcon, UserPlusIcon} from 'react-native-heroicons/solid';
import {PlusCircleIcon} from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import LoginModal from '../modals/LoginModal';


const HomeFooter = ({user}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation();

  const [loginWindow, setLoginWindow] = useState(false);

  return (
    <View className={`${isDarkTheme ? 'bg-black' : 'bg-white'}  w-full bottom-0 fixed`}>
      
        <View className="flex-row w-full justify-evenly pt-1">
            <TouchableOpacity
               onPress={() => {
                  navigation.navigate("Trending");
              }}
              className="flex items-center justify-center"
            >
              <FireIcon />
              <Text className={`${isDarkTheme ? 'text-white' : 'text-black '} text-xs font-medium`}>trending</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                if(user){
                  navigation.navigate("Published");
                }else{
                  setLoginWindow(true);
                }
              }}
              className="flex items-center"
            >
              <BookOpenIcon />
              <Text className={`${isDarkTheme ? 'text-white' : 'text-black '} text-xs font-medium`}>Published</Text>
            </TouchableOpacity>

            <TouchableOpacity 
               onPress={() => {
                if(user){
                  navigation.navigate("Create");
                }else{
                  setLoginWindow(true);
                }
              }}
              className="flex items-center"
            >
              <PlusCircleIcon size={35}/>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                if(user){
                  navigation.navigate("Following");
                }else{
                  setLoginWindow(true);
                }
              }}
              className="flex items-center">
              <UserPlusIcon />
              <Text className={`${isDarkTheme ? 'text-white' : 'text-black '} text-xs font-medium`}>Following</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex items-center"
              onPress={() => {
                if(user){
                  navigation.navigate("Reading List")
                }else{
                  setLoginWindow(true);
                }
              }}
            >
              <QueueListIcon />
              <Text className={`${isDarkTheme ? 'text-white' : 'text-black '} text-xs font-medium`}>Reading list</Text>
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

export default HomeFooter