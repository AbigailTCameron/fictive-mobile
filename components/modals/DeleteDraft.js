import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Appearance } from 'react-native'
import React from 'react'
import { TrashIcon } from 'react-native-heroicons/outline'

const DeleteDraft = ({bookTitle, onClose, onConfirm}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

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
          className={`flex-1 items-center justify-center ${isDarkTheme ? 'bg-zinc-800/[0.8]' : 'bg-black/[0.3]'} `}
        >

            <View className={`${isDarkTheme ? 'bg-zinc-950' : 'bg-white'}  rounded-xl p-6 m-10`}>
                <View className="flex-row items-center my-2">
                    <TrashIcon color="#ef4444"/>
                    <Text className=" text-red-500 font-semibold">Are you sure?</Text>
                </View>

                <Text className={`mb-1 ${isDarkTheme ? 'text-white' : 'text-black'}`}>You are about to delete <Text className="font-semibold">{bookTitle}.</Text> </Text>
        
        
                <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Note that after deleting you will not be able to recover any information related to this specific content.
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