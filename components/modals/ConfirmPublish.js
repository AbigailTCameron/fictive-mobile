import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Appearance } from 'react-native'
import React from 'react'

const ConfirmPublish = ({bookTitle, onClose, onConfirm}) => {
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

                  <Text className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>Are you sure?</Text>

                  <View className="my-1"> 
                      <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>
                          You are about to publish  
                          <Text className="font-semibold text-[#0058f7]"> {bookTitle}.</Text>
  
                      </Text>

                      <Text className={`mt-2 ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                        Note that after publishing you will not be able to alter any published chapter titles or content, however, you can 
                          alter the book cover and add additional chapters.
                      </Text>

                  </View>

                  <View className="flex-row justify-center w-full space-x-2 mt-2">

                        <TouchableOpacity
                          className={`flex-row flex-1 items-center justify-center space-x-1 px-2 py-3 text-white ${isDarkTheme ? 'bg-[#0058f7]' : 'bg-black'} rounded-xl`}
                          onPress={handleConfirm}
                        >
                          <Text className="font-semibold text-white">Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          className="px-2 py-3 flex-1 items-center text-black  bg-white rounded-xl"
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

export default ConfirmPublish