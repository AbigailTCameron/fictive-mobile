import { View, Text, Image, ActivityIndicator, Appearance } from 'react-native'
import React from 'react';

const LoadingPage = () => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  return (
    <View className={`w-full h-full items-center justify-center ${isDarkTheme ? 'bg-black' : 'bg-[#0058f7]'}  space-y-2`}>

      <View className="flex-row items-center space-x-2">
        <Image 
          source={require('../../assets/logo.png')}
          className="w-16 h-14"
        />
        <Text className="text-4xl font-bold text-white">fictive</Text>
  
      </View>
      
      <ActivityIndicator size="large" color="#ffffff"/>
      
    </View>
  )
}

export default LoadingPage