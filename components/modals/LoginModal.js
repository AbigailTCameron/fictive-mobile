import { View, Text, Modal, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, Pressable, KeyboardAvoidingView } from 'react-native'
import React, { useRef, useState } from 'react'
import { signInExplore } from '../queries/fetchUserDetails';
import { useNavigation } from '@react-navigation/native';

const LoginModal = ({onClose}) => {
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
        className="flex-1 items-center justify-center bg-black/[0.5]"
        >
          <KeyboardAvoidingView
            behavior="padding"
            enabled
          >
              <View ref={modalRef} className="bg-white rounded-xl p-6">

                  <View className="flex-row items-center mb-2 space-x-1">
                      <Image 
                        source={require('../../assets/icon.png')} 
                        className="w-8 h-8"
                      />
                      <Text className="text-xl font-semibold">fictive</Text>
                  </View>

                  <View className="flex w-full mb-2">
                      <Text>Access Fictive's catalogue of stories.</Text>
                      <Text>Sign in and start publishing your original work.</Text>
                  </View>
                  
                  <View className="flex space-y-2 my-1">

                    <TextInput
                      keyboardType='email-address'
                      placeholder="Email"
                      value={email}
                      onChangeText={handleEmailChange}
                      className="bg-white px-4 py-2 border border-slate-300 rounded-md text-sm text-black shadow-sm "
                    />

                    {emailError && <Text className="error text-red-600">Error authenticating login!!!</Text>}

                    
                    <TextInput
                      keyboardType='default'
                      placeholder="Password"
                      value={password}
                      onChangeText={handlePasswordChange}
                      secureTextEntry={true}
                      className="bg-white px-4 py-2 border border-slate-300 rounded-md text-sm text-black shadow-sm"
                    />
                    
                  </View>

                  {passwordError && <Text className="error text-red-600 text-sm">Error trying to sign in. Try again!</Text>}


                  <TouchableOpacity
                    onPress={() => signInExplore(setPasswordError, email, setEmailError, password)}
                    className="bg-[#0058f7] rounded-lg items-center my-2"
                  >
                    <Text className="text-white font-extrabold p-2">Login</Text>
                  </TouchableOpacity>

                  <Text>Don't have a fictive account?{' '}
                    <Pressable onPress={() => {
                      navigation.navigate("SignUp");
                      onClose();
                      }}
                    >
                        <Text className="text-[#0058f7]">
                          Create one
                        </Text>
                    </Pressable>
                    
                  </Text>
                

              </View>
          </KeyboardAvoidingView>
           


      </View>
      </TouchableWithoutFeedback>
      

    </Modal>
  )
}

export default LoginModal