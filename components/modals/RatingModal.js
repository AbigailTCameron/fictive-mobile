import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import {StarIcon} from 'react-native-heroicons/solid';
import { updateRating } from '../queries/fetchUserDetails';


const RatingModal = ({onClose, bookTitle, bookId, userId}) => {
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

            <View className="flex-1 items-center justify-center shadow-lg bg-black/[0.5]">

                <View className="bg-white rounded-xl p-8">
                   <Text className="font-semibold text-xl text-center mb-2">{bookTitle}</Text>

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

                   <TouchableOpacity className="bg-black items-center p-2 rounded-xl mt-2" onPress={handleSaveRating}>
                      <Text className="text-white font-medium">Save Rating</Text>
                    </TouchableOpacity>

                </View>
              
            </View>


        </TouchableWithoutFeedback>
        
    </Modal>
  )
}

export default RatingModal