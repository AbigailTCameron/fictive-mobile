import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Linking, KeyboardAvoidingView, Appearance } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import HomeHeader from '../components/headers/HomeHeader';
import { handleSignUp } from '../components/queries/fetchUserDetails';

const NewAccountScreen = ({user, userDetails}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

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
      className={`flex-1 ${isDarkTheme ? 'bg-black' : ''}`}
      behavior="padding" // Adjust the behavior as needed
      enabled
    >

      <View className={`flex-0 ${isDarkTheme ? 'bg-black' : 'bg-[#0059f7]'}`}/>


      <SafeAreaView className={`flex-0 z-50 ${isDarkTheme ? 'bg-black' : 'bg-[#0058f7]'}`}>
          <HomeHeader user={user} userDetails={userDetails}/>
      </SafeAreaView>

      <View className="m-4 h-full">
        
          <View className="flex flex-col items-center text-center space-y-2 mb-4">
            <Text className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-black'}`}>Create Your Fictive account</Text>
            <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>This connects you to all your published stories, the ones you read, and those that you have yet to read.</Text>
          </View>

          <View className="flex-row w-full space-x-2 mb-4">
              <TextInput 
                keyboardType='default'
                className={`flex-1 ${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white border-slate-300 text-black'} outline-none px-4 py-3 border rounded-md text-sm shadow-sm`}
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                placeholder="First Name"
                placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                required
              />
              <TextInput 
                keyboardType='default'
                className={`flex-1 ${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white border-slate-300 text-black'} outline-none px-4 py-3 border rounded-md text-sm shadow-sm`}
                value={lastName}
                onChangeText={(text) => setLastName(text)}
                placeholder="Last Name"
                placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                required
              />
          </View>

       
          <View className='space-y-3'>
              <Text className="text-slate-500 dark:text-slate-200">This will be your Fictive ID.</Text>

              <TextInput 
                className={`outline-none ${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white border-slate-300 text-black'} px-4 py-3 border rounded-md text-sm shadow-sm`}
                keyboardType='email-address'
                placeholder="Email"
                placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                value={email}
                onChangeText={handleEmailChange}
                required
              />
              {emailError && <Text className="error text-red-600">Email already exists!!!</Text>}


              <TextInput 
                className={`outline-none ${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white border-slate-300 text-black'} px-4 py-3 border rounded-md text-sm shadow-sm`}
                keyboardType='default'
                value={username}
                onChangeText={handleUsernameChange}
                placeholder="Username"
                placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                required
              />
              {usernameError && <Text className="error text-red-600">Username already exists!!!</Text>}


              <TextInput 
                className={`outline-none ${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white border-slate-300 text-black'} px-4 py-3 border rounded-md text-sm shadow-sm`}
                keyboardType='default'
                placeholder="Password"
                placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={true}
              />

              <TextInput 
                className={`outline-none ${isDarkTheme ? 'bg-zinc-600 text-white border-zinc-600' : 'bg-white border-slate-300 text-black'} px-4 py-3 border rounded-md text-sm shadow-sm`}
                keyboardType='default'
                placeholder="Confirm Password"
                placeholderTextColor={`${isDarkTheme ? '#d4d4d8' : ''}`}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={true}
              />
              {passwordMatchError && <Text className="error text-red-600">{passwordMatchError}</Text>}

          </View>

         

          <View className="flex mt-8 items-center text-center">
              <Text className={`${isDarkTheme ? 'text-white' : 'text-black'}`}>If you choose to continue then you are agreeing to our 
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