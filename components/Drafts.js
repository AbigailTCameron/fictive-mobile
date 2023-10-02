import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {PlusCircleIcon} from 'react-native-heroicons/outline';
import LoginModal from './modals/LoginModal';


const Drafts = ({user, draftsData}) => {
  const navigation = useNavigation();
  const [loginWindow, setLoginWindow] = useState(false);

  const handleDraftClick = (draftId) => {
    navigation.navigate("SpecificDraft", {
      draftId
    });
  };

  return (
    <View>
        {draftsData.length < 1 ? (

            <View className="h-full w-full items-center justify-center">

                <TouchableOpacity 
                  onPress={() => {
                    if(user){
                      navigation.navigate("Create");
                    }else{
                      setLoginWindow(true);
                    }
                  }}
                  className="items-center bg-white p-8 rounded-xl shadow-md drop-shadow-2xl"
                >
                    <PlusCircleIcon size={80}/>
                    <Text className="font-medium">Create your first story</Text>
                </TouchableOpacity>
              
            </View>

        ) : (
          <View className="mx-3 my-1 space-y-2">
            {draftsData.map((draft) => (
                <TouchableOpacity
                  onPress={() => handleDraftClick(draft.id)}
                  className="bg-white rounded-xl py-4 px-4 shadow-sm flex-row space-x-4"
                  key={draft.id}
                >
                  {draft.image_url ? (
                      <Image 
                        source={{
                          uri: draft.image_url
                        }}
                        className="w-32 h-48 rounded-lg"
                      />
                     
                  ) : (
                      <Image 
                        source={require('../assets/no-cover.png')}
                        className="w-32 h-48 border-[1px] rounded-lg"
                      />
                  )}
  
                  <View className="space-y-1 flex-1">
                      <Text className="text-lg font-bold text-[#0059f7]">{draft.bookTitle}</Text>
                      <Text>Chapters: {draft.chapters.length}</Text>
  
                      <View className="flex-row w-full max-w-full flex-wrap space-x-1">
                          {draft.tags.map((tag, index) => (
                              <View key={index} style={{marginVertical: 2}} className="border-2 rounded-md border-[#eaeaea]">
                                <Text className="p-1 text-sm font-semibold text-zinc-500">{tag}</Text>
                              </View>
                          ))}
  
                      </View>
                      <View className="w-full overflow-hidden">
                        <Text 
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{
                            fontSize: 14,
                            lineHeight: 20, 
                          }}
                        >{draft.synopsis}
                        </Text>
                      </View>
  
                  </View>
  
              </TouchableOpacity>
            ))}
          </View>

        )}

        {loginWindow && (
          <LoginModal 
            onClose={() => setLoginWindow(false)}
          />
        )}
    </View>
  )
}

export default Drafts