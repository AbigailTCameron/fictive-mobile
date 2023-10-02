import { View, Text, Modal, TouchableWithoutFeedback, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react';
import {TrashIcon, ChatBubbleLeftIcon} from 'react-native-heroicons/outline';
import { deleteComment } from '../queries/fetchUserDetails';

const ReplyDeleteModal = ({onClose, comment, userDetails, commenter, bookId, chapterId, commentId, handleReply}) => {

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
                <View className="bg-white rounded-xl space-y-2 px-4 py-4 mx-6">

                  <Text
                    className="text-gray-400"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 14,
                      lineHeight: 15, 
                    }}
                  >
                    {comment}
                  </Text>

                  <View className="space-y-3">
                      <TouchableOpacity
                        onPress={handleReply}
                        className="flex-row items-center space-x-2"
                      >
                        <ChatBubbleLeftIcon size={20} color="black"/>
                        <Text>Reply</Text>
                      </TouchableOpacity>

                      {userDetails.uid === commenter && (
                        <TouchableOpacity 
                          onPress={() => deleteComment(bookId, chapterId, commentId)}
                          className="flex-row items-center space-x-2"
                        >
                          <TrashIcon size={20} color="black"/>
                          <Text>Delete</Text>
                        </TouchableOpacity>
                      )}
                      
                      
                  </View>

                </View>

            </SafeAreaView>

        </TouchableWithoutFeedback>

    </Modal>
  )
}

export default ReplyDeleteModal