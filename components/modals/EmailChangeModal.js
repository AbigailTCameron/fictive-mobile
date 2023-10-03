import { View, Text, Modal, TouchableOpacity, TextInput, TouchableWithoutFeedback, Appearance } from 'react-native'
import React, { useState } from 'react'
import { reauthenticate } from '../queries/fetchUserDetails';

const EmailChangeModal = ({onClose, onConfirm, setEmailLoginPopup}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

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
        className={`flex-1 items-center justify-center ${isDarkTheme ? 'bg-zinc-800/[0.7]' : 'bg-black/[0.5]'} `}
        >

          <View className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded-xl p-6 m-4`}>


              <View className="flex w-full mb-2">
                  <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>To change your email, you need to reauthenticate:</Text>
              </View>
              
              <View className="flex space-y-2 my-1">

                <TextInput
                  keyboardType='email-address'
                  placeholder="Email old email..."
                  placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                  value={email}
                  onChangeText={handleEmailChange}
                  className={`outline-none ${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white border-slate-300 text-black'} px-4 py-2 border rounded-md text-sm shadow-sm focus:outline-none`}
                />

                
                <TextInput
                  keyboardType='default'
                  placeholder="Password"
                  placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={true}
                  className={`outline-none ${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white border-slate-300 text-black'} px-4 py-2 border rounded-md text-sm shadow-sm focus:outline-none`}
                />
                
                {emailError && <Text className="error text-red-600">Error authenticating login!!!</Text>}
              </View>

              <View className="flex-row justify-center w-full space-x-2 mt-2">

                  <TouchableOpacity
                    className={`flex-row flex-1 items-center justify-center space-x-1 px-2 py-3 text-white ${isDarkTheme ? 'bg-white' : 'bg-black'}  rounded-xl`}
                    onPress={handleConfirm}
                  >
                    <Text className={`font-semibold ${isDarkTheme ? 'text-black' : 'text-white'} `}>Confirm</Text>
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