import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { changeEmail, changePassword, updateAccount } from './queries/fetchUserDetails';
import { useNavigation } from '@react-navigation/native';
import EmailChangeModal from './modals/EmailChangeModal';
import PasswordChangeModal from './modals/PasswordChangeModal';

const Settings = ({userDetails, setUserDetails}) => {
  const navigation = useNavigation(); 

  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState("");

  const firstNameHolder = userDetails.firstName;
  const lastNameHolder = userDetails.lastName;

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const emailHolder = userDetails.email;

  const [bio, setBio] = useState("");
  const bioHolder = userDetails.bio;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const [emailLoginPopup, setEmailLoginPopup] = useState(false);
  const [passwordLoginPopup, setPasswordLoginPopup] = useState(false);


  const handleEmailChange = (text) => {
    setEmail(text);

    if(emailError) {
      setEmailError(false);
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);

    if (passwordMatchError) {
      setPasswordMatchError(false);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);

    if (passwordMatchError) {
      setPasswordMatchError(false);
    }
  };

  const handleUpdateAccount = async() => {
    let updatedFields = {};

    let firstNameTrimmed = firstName.trim();
    let lastNameTrimmed = lastName.trim();
    let bioTrimmed = bio.trim();

    if (firstNameTrimmed !== '') {
      updatedFields.firstName = firstNameTrimmed;
    }

    if (lastNameTrimmed !== '') {
      updatedFields.lastName = lastNameTrimmed;
    }

    if (bioTrimmed !== '') {
      updatedFields.bio = bioTrimmed;
    }


    if(firstNameTrimmed !== firstNameHolder || lastNameTrimmed !== lastNameHolder || bioTrimmed !== bioHolder){
        await updateAccount(userDetails.uid, firstNameTrimmed, lastNameTrimmed, bioTrimmed, navigation);

        setUserDetails((prevUserDetails) => ({
          ...prevUserDetails,
          ...updatedFields
        }));
    }
  }

  const handleEmailUpdate = async() => {
    let emailTrimmed = email.trim(); 
    if(emailTrimmed || emailHolder){
      await changeEmail(emailTrimmed, userDetails.uid, setEmailError, setUserDetails);
    }
  }

  const validatePassword = () => {
    return password === confirmPassword;
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled
      className="m-4"
    >
        <View className="space-y-4 mb-8">
              <Text className="text-lg font-semibold">Account</Text>
              <View className="flex-1 flex-row space-x-4">
                  <View className="flex-1 space-y-1">
                      <Text className="text-base font-medium">First name:</Text>
                      <TextInput 
                        className="flex-1 p-4 rounded-lg text-black border border-slate-300 bg-white"
                        placeholder={firstNameHolder}
                        value={firstName}
                        onChangeText={(text) => setFirstName(text)}
                      />
                  </View>

                  <View className="flex-1 space-y-1">
                      <Text className="text-base font-medium">Last name:</Text>
                      <TextInput 
                        className="flex-1 p-4 rounded-lg text-black border border-slate-300 bg-white"
                        placeholder={lastNameHolder}
                        value={lastName}
                        onChangeText={(text) => setLastName(text)}
                      />
                  </View>
              </View>

              <View className="flex-1">
                    <Text className="text-base font-medium">Bio</Text>
                    <TextInput 
                      keyboardType='default'
                      className="flex-1 p-4 rounded-lg text-black border border-slate-300 bg-white"
                      placeholder={bioHolder}
                      value={bio}
                      onChangeText={(text) => setBio(text)}
                    />

              </View>


              <TouchableOpacity onPress={handleUpdateAccount} className="bg-[#0058f7] items-center py-3 px-8 rounded-xl mt-1">
                <Text className="text-white font-bold">Update</Text>
              </TouchableOpacity>

        </View>
         

          <View className="space-y-6 my-8">
                <Text className="text-lg font-semibold">Security</Text>
                <View className="flex-1">
                    <Text className="text-base font-medium">Email</Text>
                    <TextInput 
                      keyboardType='email-address'
                      className="flex-1 p-4 rounded-lg text-black border border-slate-300 bg-white"
                      placeholder={emailHolder}
                      value={email}
                      onChangeText={handleEmailChange}
                    />
                    {emailError && <Text className="error text-red-600">Email already exists!!!</Text>}

                    <TouchableOpacity onPress={() => setEmailLoginPopup(true)} className="bg-[#0058f7] items-center py-3 px-8 rounded-xl mt-4">
                      <Text className="text-white font-bold">Update email</Text>
                    </TouchableOpacity>

                </View>

                {emailLoginPopup && (
                  <EmailChangeModal 
                    onClose={() => setEmailLoginPopup(false)}
                    onConfirm={handleEmailUpdate}
                    setEmailLoginPopup={setEmailLoginPopup}
                  />
                )}

                <View className="flex-1">
                    <Text className="text-base font-medium">New Password</Text>
                    <TextInput 
                        className="flex-1 p-4 rounded-lg text-black border border-slate-300 bg-white"
                        keyboardType='default'
                        placeholder="Password"
                        value={password}
                        onChangeText={handlePasswordChange}
                        secureTextEntry={true}
                    />
                </View>

              
                <View className="flex-1">
                    <Text className="text-base font-medium">Confirm Password</Text>
                    <TextInput 
                        className="flex-1 p-4 rounded-lg text-black border border-slate-300 bg-white"
                        keyboardType='default'
                        placeholder="Password"
                        value={confirmPassword}
                        onChangeText={handleConfirmPasswordChange}
                        secureTextEntry={true}
                    />

                    {passwordMatchError && <Text className="error text-red-600">Passwords do not match!!!</Text>}

                    <TouchableOpacity onPress={() => setPasswordLoginPopup(true)} className="bg-[#0058f7] items-center py-3 px-8 rounded-xl mt-4">
                      <Text className="text-white font-bold">Update password</Text>
                    </TouchableOpacity>

                </View>

                {passwordLoginPopup && (
                  <PasswordChangeModal 
                    onClose={() => setPasswordLoginPopup(false)}
                    onConfirm={() => changePassword(password, setPasswordMatchError, validatePassword, navigation)}
                    setPasswordLoginPopup={setPasswordLoginPopup}
                  />
                )}


          </View>

         
          



    </KeyboardAvoidingView>
  )
}

export default Settings