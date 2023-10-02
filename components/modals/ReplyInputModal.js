import { View, Text, Modal, TouchableWithoutFeedback, SafeAreaView, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { PaperAirplaneIcon } from 'react-native-heroicons/outline';
import { handlePostReply } from '../queries/fetchUserDetails';

const ReplyInputModal = ({onClose, userDetails, user, comment, username, bookId, chapterId, commentId}) => {
  const [replyText, setReplyText] = useState('');

  const handleReplyChange = (text) => {
    setReplyText(text);
  }

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
            <SafeAreaView className="flex-1 justify-end bottom-0 bg-black/[0.3]">
              <KeyboardAvoidingView
              behavior="padding"
              enabled
              >
                 <View className="bg-white rounded-xl space-y-2 px-2 py-2 mx-2">
                    <View className="flex-row items-center">
                       <Text className="text-gray-400">@{username}</Text>
                        <Text
                            className="text-gray-400"
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            : {comment}
                        </Text>
                    </View>
                   

                    <View className="flex-row p-1 w-full space-x-1 items-center">

                            <View className="flex-1 flex-row items-center bg-gray-200 rounded-xl p-2">
                                {userDetails.profilePictureURL ? (
                                    <Image 
                                      source={{
                                        uri: userDetails.profilePictureURL
                                      }}
                                      className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <Image 
                                      source={require(`../../assets/tiuser.png`)}
                                      className="w-10 h-10 rounded-full"
                                    />
                                )}

                                <TextInput 
                                  className="flex-1 p-2 bg-gray-200 text-black"
                                  placeholder='Reply...'
                                  value={replyText}
                                  onChangeText={handleReplyChange}
                                  multiline
                                />

                                <TouchableOpacity  
                                  onPress={() => {
                                    if(user){
                                      handlePostReply(replyText, bookId, chapterId, commentId, userDetails.uid, setReplyText);
                                      closeModal(); 
                                    }else{
                                      setLoginWindow(true);
                                    }
                                  }}
                                  className="bg-zinc-600 rounded-lg ml-2 px-4 py-1"
                                >
                                  <PaperAirplaneIcon color="white"/>
                                </TouchableOpacity>
                            </View>
                    </View>
               

                </View>
              </KeyboardAvoidingView>
               
              
            </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default ReplyInputModal