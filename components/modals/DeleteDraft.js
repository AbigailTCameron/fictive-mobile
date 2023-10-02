import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React from 'react'
import { TrashIcon } from 'react-native-heroicons/outline'

const DeleteDraft = ({bookTitle, onClose, onConfirm}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const closeModal = () => {
    onClose();
  };


  return (
    <Modal
      transparent={true} 
      animationType="fade" 
      visible={true} 
    >
      <TouchableWithoutFeedback>
        <View 
          className="flex-1 items-center justify-center bg-black/[0.5]"
        >

            <View className="bg-white rounded-xl p-6 m-10">
                <View className="flex-row items-center my-2">
                    <TrashIcon color="#ef4444"/>
                    <Text className=" text-red-500 font-semibold">Are you sure?</Text>
                </View>

                <Text className="mb-1">You are about to delete <Text className="font-semibold">{bookTitle}.</Text> </Text>
        
        
                <Text>Note that after deleting you will not be able to recover any information related to this specific content.
                </Text>

                <View className="flex-row justify-center w-full space-x-2 my-2">
                  <TouchableOpacity
                    className="flex-row flex-1 items-center justify-center space-x-1 px-2 py-3 text-white bg-red-500 rounded-xl"
                    onPress={handleConfirm}
                  >
                    <TrashIcon color="white"/>
                    <Text className="font-semibold text-white">Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="px-2 py-3 flex-1 items-center text-black border-2 border-black bg-white rounded-xl"
                    onPress={closeModal}
                  >
                    <Text className="font-semibold">Cancel</Text>
                  </TouchableOpacity>
                </View>
            </View>


        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default DeleteDraft