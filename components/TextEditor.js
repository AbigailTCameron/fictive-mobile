import { View, Text, StyleSheet, StatusBar, SafeAreaView, Appearance, ScrollView } from 'react-native';
import React from 'react';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";

const action = [
  actions.insertImage,
  actions.setBold, 
  actions.setItalic, 
  actions.setStrikethrough,
  actions.setUnderline, 
  actions.heading1,
  actions.insertBulletsList,  
  actions.insertOrderedList,
  actions.insertLink,
  actions.removeFormat,
  actions.insertVideo
]

const TextEditor = ({storyContent, setStoryContent, showWarning, setShowWarning}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const richText = React.useRef();

  const handleHead = ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>



  return (
    <View className="relative" style={{flex:1}}>

      <View className="sticky">
          <RichToolbar
            editor={richText}
            actions={action}
            iconMap={{ [actions.heading1]: handleHead }}
            style={{ borderTopWidth: 1, borderTopColor: '#ccc' }}
          />   
      </View>

     
     
      <ScrollView style={{flex: 1}}>
          <RichEditor
              ref={richText}
              initialContentHTML={storyContent}
              placeholder="Write your story here..."
              onChange={(html) => {
                setStoryContent(html);
                if (showWarning) {
                  setShowWarning(false);
                }
              }}
              editorStyle={{ backgroundColor: `${isDarkTheme ? 'black' : '#f3f4f6'}`, color: `${isDarkTheme ? 'white' : 'black'}`, minHeight: 300 }}
          />
      </ScrollView>
   

    </View>
  )
}


export default TextEditor