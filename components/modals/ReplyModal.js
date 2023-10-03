import { View, Text, Modal, TouchableWithoutFeedback, SafeAreaView, TouchableOpacity, Appearance } from 'react-native'
import React from 'react';
import {TrashIcon, ChatBubbleLeftIcon} from 'react-native-heroicons/outline';
import { deleteReply } from '../queries/fetchUserDetails';

const ReplyModal = ({onClose, reply, replier, bookId, chapterId, commentId, replyId, userDetails, handleReply}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

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

            <SafeAreaView className={`flex-1 justify-end bottom-0 ${isDarkTheme ? 'bg-zinc-800/[0.7]' : 'bg-black/[0.3]'} `}>
                <View className={`${isDarkTheme ? 'bg-black' : 'bg-white'}  rounded-xl space-y-2 px-4 py-4 mx-6`}>

                  <Text
                    className="text-gray-400"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 14,
                      lineHeight: 15, 
                    }}
                  >
                    {reply}
                  </Text>

                  <View className="space-y-3">
                      <TouchableOpacity
                        onPress={handleReply}
                        className="flex-row items-center space-x-2"
                      >
                        <ChatBubbleLeftIcon size={20} color={`${isDarkTheme ? 'white' : 'black'}`}/>
                        <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Reply</Text>
                      </TouchableOpacity>

                      {userDetails.uid === replier && (
                        <TouchableOpacity 
                         onPress={() => deleteReply(bookId, chapterId, commentId, replyId)}
                          className="flex-row items-center space-x-2"
                        >
                          <TrashIcon size={20} color={`${isDarkTheme ? 'white' : 'black'}`}/>
                          <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Delete</Text>
                        </TouchableOpacity>
                      )}
                      
                      
                  </View>

                </View>

            </SafeAreaView>

        </TouchableWithoutFeedback>

    </Modal>
  )
}

export default ReplyModal