import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Linking, KeyboardAvoidingView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import { handleSignUp } from '../components/queries/fetchUserDetails';

const NewAccountScreen = ({user, userDetails}) => {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, []); 

  const validatePassword = () => {
    return password === confirmPassword;
  };


  const handleEmailChange = (text) => {
    setEmail(text);

    if(emailError) {
      setEmailError(false);
    }
  };

  const handleUsernameChange = (text) => {
    setUsername(text);

    if (usernameError) {
      setUsernameError(false);
    }
  }


  const handlePasswordChange = (text) => {
    setPassword(text);

    if (passwordMatchError) {
      setPasswordMatchError('');
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);

    if (passwordMatchError) {
      setPasswordMatchError('');
    }
  };

  const handleTermsOfUsePress = () => {
    // Open the Terms of Use link in the device's default browser
    Linking.openURL('https://fictivelabs.com/terms-of-use');
  };

  const handlePrivacyPolicyPress = () => {
    // Open the Privacy Policy link in the device's default browser
    Linking.openURL('https://fictivelabs.com/privacy');
  };

  

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior="padding" // Adjust the behavior as needed
      enabled
    >

      <View className="flex-0 bg-[#0059f7]"/>

      <SafeAreaView className="flex-0 z-50 bg-[#0058f7]">
          <HomeHeader user={user} userDetails={userDetails}/>
      </SafeAreaView>

      <View className="m-4 h-full">
        
          <View className="flex flex-col items-center text-center space-y-2 mb-4">
            <Text className="text-xl font-bold">Create Your Fictive account</Text>
            <Text>This connects you to all your published stories, the ones you read, and those that you have yet to read.</Text>
          </View>

          <View className="flex-row w-full space-x-2 mb-4">
              <TextInput 
                keyboardType='default'
                className="flex-1 outline-none bg-white px-4 py-3 border border-slate-300 rounded-md text-sm placeholder-slate-400 shadow-sm"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                placeholder="First Name"
                required
              />
              <TextInput 
                keyboardType='default'
                className="flex-1 outline-none bg-white px-4 py-3 border border-slate-300 rounded-md text-sm placeholder-slate-400 shadow-sm"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
                placeholder="Last Name"
                required
              />
          </View>

       
          <View className='space-y-3'>
              <Text className="text-slate-500 dark:text-slate-200">This will be your Fictive ID.</Text>

              <TextInput 
                className="outline-none bg-white px-4 py-3 border border-slate-300 rounded-md text-sm placeholder-slate-400 shadow-sm"
                keyboardType='email-address'
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
                required
              />
              {emailError && <Text className="error text-red-600">Email already exists!!!</Text>}


              <TextInput 
                className="outline-none bg-white px-4 py-3 border border-slate-300 rounded-md text-sm placeholder-slate-400 shadow-sm"
                keyboardType='default'
                value={username}
                onChangeText={handleUsernameChange}
                placeholder="Username"
                required
              />
              {usernameError && <Text className="error text-red-600">Username already exists!!!</Text>}


              <TextInput 
                className="outline-none bg-white px-4 py-3 border border-slate-300 rounded-md text-sm placeholder-slate-400 shadow-sm"
                keyboardType='default'
                placeholder="Password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={true}
              />

              <TextInput 
                className="outline-none bg-white px-4 py-3 border border-slate-300 rounded-md text-sm placeholder-slate-400 shadow-sm"
                keyboardType='default'
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={true}
              />
              {passwordMatchError && <Text className="error text-red-600">{passwordMatchError}</Text>}

          </View>

         

          <View className="flex mt-8 items-center text-center">
              <Text>If you choose to continue then you are agreeing to our 
                <Text className="text-[#0059f7]" onPress={handleTermsOfUsePress}> Terms of Use </Text>
                and 
                <Text className="text-[#0059f7]" onPress={handlePrivacyPolicyPress}> Privacy Policy</Text>
                .
              </Text>
          </View>

          <TouchableOpacity onPress={() => handleSignUp(validatePassword, username.trim(), email.trim(), firstName.trim(), lastName.trim(), setUsernameError, setEmailError, password, navigation, setPasswordMatchError)} className="bg-[#0059f7] py-3 rounded-xl items-center mt-6">
            <Text className="text-white font-bold">Sign up</Text>
          </TouchableOpacity>

      </View>

        
      

    </KeyboardAvoidingView>
  )
}

export default NewAccountScreen