import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Appearance } from 'react-native'
import React, { useEffect, useState } from 'react';
import {StarIcon} from 'react-native-heroicons/solid';
import { updateRating } from '../queries/fetchUserDetails';


const RatingModal = ({onClose, bookTitle, bookId, userId}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const [rating, setRating] = useState(0);

  const closeModal = () => {
    onClose();
  }

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSaveRating = () => {
    updateRating(bookId, rating, userId);
    onClose();
  }

  
  
  return (
    <Modal 
      transparent={true} 
      animationType="fade" 
      visible={true} 
      onRequestClose={closeModal}
    >
        <TouchableWithoutFeedback onPress={closeModal}>

            <View className={`flex-1 items-center justify-center shadow-lg ${isDarkTheme ? 'bg-zinc-800/[0.7]' : 'bg-black/[0.5]'} `}>

                <View className={`${isDarkTheme ? 'bg-black' : 'bg-white '} rounded-xl p-8`}>
                   <Text className={`${isDarkTheme ? 'text-white' : 'text-black'} font-semibold text-xl text-center mb-2`}>{bookTitle}</Text>

                   <View className="flex-row">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <TouchableWithoutFeedback
                        key={value}
                        onPress={() => handleRatingChange(value)}
                      >
                        <StarIcon size={30} color={`${rating >= value ? '#047cfc' : '#d1d5db'}`}/>

                      </TouchableWithoutFeedback>
                    ))}
                   </View>

                   <TouchableOpacity className={`${isDarkTheme ? 'bg-white' : 'bg-black'}  items-center p-2 rounded-xl mt-2`} onPress={handleSaveRating}>
                      <Text className={`${isDarkTheme ? 'text-black' : 'text-white'}  font-medium`}>Save Rating</Text>
                    </TouchableOpacity>

                </View>
              
            </View>


        </TouchableWithoutFeedback>
        
    </Modal>
  )
}

export default RatingModal