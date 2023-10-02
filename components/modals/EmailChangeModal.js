import { View, Text, Modal, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { reauthenticate } from '../queries/fetchUserDetails';

const EmailChangeModal = ({onClose, onConfirm, setEmailLoginPopup}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');


  const closeModal = () => {
    onClose();
  };

  const handleEmailChange = (text) => {
    setEmail(text);

    if (emailError) {
      setEmailError(false);
    }
  };

  const handleConfirm = async() => {
    await reauthenticate(email, password, setEmailError, onConfirm, setEmailLoginPopup);
  };


  return (
    <Modal 
      transparent={true} 
      animationType="fade" 
      visible={true} 
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
      <View 
        className="flex-1 items-center justify-center bg-black/[0.5]"
        >

          <View className="bg-white rounded-xl p-6 m-4">


              <View className="flex w-full mb-2">
                  <Text>To change your email, you need to reauthenticate:</Text>
              </View>
              
              <View className="flex space-y-2 my-1">

                <TextInput
                  keyboardType='email-address'
                  placeholder="Email old email..."
                  value={email}
                  onChangeText={handleEmailChange}
                  className="outline-none bg-white px-4 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 shadow-sm focus:outline-none"
                />

                
                <TextInput
                  keyboardType='default'
                  placeholder="Password"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={true}
                  className="outline-none bg-white dark:bg-zinc-700 dark:text-white px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-md text-sm placeholder-slate-400 shadow-sm focus:outline-none"
                />
                
                {emailError && <Text className="error text-red-600">Error authenticating login!!!</Text>}
              </View>

              <View className="flex-row justify-center w-full space-x-2 mt-2">

                  <TouchableOpacity
                    className="flex-row flex-1 items-center justify-center space-x-1 px-2 py-3 text-white bg-black rounded-xl"
                    onPress={handleConfirm}
                  >
                    <Text className="font-semibold text-white">Confirm</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="px-2 py-3 flex-1 items-center text-black bg-red-500 rounded-xl"
                    onPress={closeModal}
                  >
                    <Text className="font-semibold text-white">Cancel</Text>
                  </TouchableOpacity>

              </View>
        

          </View>


      </View>
      </TouchableWithoutFeedback>
      

    </Modal>
  )
}

export default EmailChangeModal