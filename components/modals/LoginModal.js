import { View, Text, Modal, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, Pressable, KeyboardAvoidingView, Appearance } from 'react-native'
import React, { useRef, useState } from 'react'
import { signInExplore } from '../queries/fetchUserDetails';
import { useNavigation } from '@react-navigation/native';

const LoginModal = ({onClose}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const navigation = useNavigation();

  const modalRef = useRef(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);


  const closeModal = () => {
    onClose();
  };

  const handleEmailChange = (text) => {
    setEmail(text);

    if (emailError) {
      setEmailError(false);
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);

    if (passwordError) {
      setPasswordError(false);
    }
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
        className={`flex-1 items-center justify-center ${isDarkTheme ? 'bg-zinc-800/[0.7]' : 'bg-black/[0.5]'}`}
        >
          <KeyboardAvoidingView
            behavior="padding"
            enabled
          >
              <View ref={modalRef} className={`${isDarkTheme ? 'bg-black' : 'bg-white'}  rounded-xl p-6`}>

                  <View className="flex-row items-center mb-2 space-x-1">
                      <Image 
                        source={require('../../assets/icon.png')} 
                        className="w-8 h-8"
                      />
                      <Text className={`${isDarkTheme ? 'text-white' : 'text-black'} text-xl font-semibold`}>fictive</Text>
                  </View>

                  <View className="flex w-full mb-2">
                      <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Access Fictive's catalogue of stories.</Text>
                      <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Sign in and start publishing your original work.</Text>
                  </View>
                  
                  <View className="flex space-y-2 my-1">

                    <TextInput
                      keyboardType='email-address'
                      placeholder="Email"
                      placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                      value={email}
                      onChangeText={handleEmailChange}
                      className={`outline-none ${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white border-slate-300 text-black'} px-4 py-2 border rounded-md text-sm shadow-sm focus:outline-none`}
                      />

                    {emailError && <Text className="error text-red-600">Error authenticating login!!!</Text>}

                    
                    <TextInput
                      keyboardType='default'
                      placeholder="Password"
                      placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                      value={password}
                      onChangeText={handlePasswordChange}
                      secureTextEntry={true}
                      className={`outline-none ${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white border-slate-300 text-black'} px-4 py-2 border rounded-md text-sm shadow-sm focus:outline-none`}
                      />
                    
                  </View>

                  {passwordError && <Text className="error text-red-600 text-sm">Error trying to sign in. Try again!</Text>}


                  <TouchableOpacity
                    onPress={() => signInExplore(setPasswordError, email, setEmailError, password)}
                    className="bg-[#0058f7] rounded-lg items-center my-2"
                  >
                    <Text className="text-white font-extrabold p-2">Login</Text>
                  </TouchableOpacity>

                  <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>Don't have a fictive account?{' '}
                    
                      <Text onPress={() => {
                        navigation.navigate("SignUp");
                        onClose();
                      }} 
                      className="text-[#0058f7]">
                          Create one
                        </Text>
                  
                    
                  </Text>
                

              </View>
          </KeyboardAvoidingView>
           


      </View>
      </TouchableWithoutFeedback>
      

    </Modal>
  )
}

export default LoginModal