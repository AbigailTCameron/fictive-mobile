import { View, Image, TextInput, Pressable, Appearance } from 'react-native'
import React, { useEffect, useState } from 'react';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import SearchResults from '../SearchResults';
import { performSearch } from '../queries/fetchUserDetails';
import LoginModal from '../modals/LoginModal';
import { useNavigation } from '@react-navigation/native';
import HeaderMenu from '../modals/HeaderMenu';

const HomeHeader = ({user, userDetails}) => {
  const colorScheme = Appearance.getColorScheme();
  const isDarkTheme = colorScheme === 'dark';


  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [loginWindow, setLoginWindow] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery, setSearchResults);
    }else {
      setSearchResults([]);
    }
  }, [searchQuery])
  

  return (
    <View className={`relative ${isDarkTheme? 'bg-black' : 'bg-[#0058f7]'} flex-row w-full space-x-2 items-center p-2`}>

        <Pressable 
          onPress={() => navigation.navigate('Home')}
        >
          <Image 
            source={require('../../assets/logo.png')} 
            className="w-12 h-8 "
          />
        </Pressable>
    
        <View className="flex-1 relative">
            <View className="flex-row w-full justify-between bg-white dark:bg-zinc-700 dark:text-white py-2 px-4 rounded-full">
              <TextInput
                keyboardType='default'
                className={`outline-none ${isDarkTheme ? 'bg-zinc-700 text-white' : 'bg-white text-black'}`} 
                placeholder="Search for books, users, genres..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />

              <MagnifyingGlassIcon size={20} color={`${isDarkTheme ? 'white' : 'gray'}`}/>
            </View>
            
            {searchResults.length > 0 && (
              <View  className={`absolute top-full right-0 left-0 ${isDarkTheme ? 'bg-zinc-700' : 'bg-[#fff]'}  shadow-lg shadow-[#0000001A] rounded-xl p-2 w-full`}>
                <SearchResults userDetails={userDetails} results={searchResults}/>
              </View>
            )}
        </View>

        
    
        <View>
            <Pressable 
              onPress={() => {
                if(user){
                  setDropdownVisible(true);
                }else{
                  setLoginWindow(true);
                }
            }}>
                {user && userDetails.profilePictureURL ? (
                  <Image 
                      source={{
                        uri: userDetails.profilePictureURL
                      }} 
                      className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <Image 
                    source={require('../../assets/tiuser1.png')} 
                    className="w-10 h-10 rounded-full"
                  />
                )}
            </Pressable>

            {loginWindow && (
              <LoginModal
                onClose={() => setLoginWindow(false)}
              />
            )}
        </View>

        {isDropdownVisible && ( 
          <HeaderMenu 
            userDetails={userDetails}
            onClose={() => setDropdownVisible(false)}
          />
        )}

    

    </View>

  )
}

export default HomeHeader