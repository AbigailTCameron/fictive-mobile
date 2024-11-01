import { View, Text, Appearance, useWindowDimensions } from 'react-native'
import React from 'react';
import RenderHtml from 'react-native-render-html';


const BookContent = ({content, chapter, chapterTitle}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';
  const { width } = useWindowDimensions();


  const source = {
    html: `<div style="text-align: left; color: ${isDarkTheme ? 'white' : 'black'};">
   ${content}
  </div>`
  };

  const tagsStyles = {
    p: {
      marginBottom: 0, // Adjust the marginBottom value to reduce the spacing
    },
  };
  
 

  return (
    <View className="flex-1 mx-2 text-justify">
        <View className="items-center justify-center mt-20 mb-10">
          <Text className={`text-xl font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>{chapter + 1}</Text>
          <Text className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-black'}`}>{chapterTitle}</Text>
        </View>

        <View className="flex-1 w-full mx-auto p-2 text-justify">
          <View className="mx-2 whitespace-pre-wrap">
              <RenderHtml
                source={source}
                contentWidth={width} // Adjust this value as needed
                tagsStyles={tagsStyles}
              />

          </View>

        </View>

    </View>
  )
}

export default BookContent