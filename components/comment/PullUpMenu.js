import { View, Text, Pressable, Image, TextInput, TouchableOpacity, ScrollView, Modal, Dimensions, TouchableWithoutFeedback, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react';
import {PaperAirplaneIcon, XMarkIcon} from 'react-native-heroicons/outline';
import CommentSection from './CommentSection';
import { handlePostComment } from '../queries/fetchUserDetails';
import LoginModal from '../modals/LoginModal';


const PullUpMenu = ({user, isBottomSheetOpen, handleCloseBottomSheet, userDetails, comments, setBatchSize, hasMoreComments, bookId, chapterId}) => {
  const windowHeight = Dimensions.get('window').height;

  const [newComment, setNewComment] = useState('');
  const [loginWindow, setLoginWindow] = useState(false);

  const handleLoadMoreComments = () => {
    setBatchSize((prevBatchSize) => prevBatchSize + 10);
  };

  const handleCommentChange = (text) => {
    setNewComment(text);
  };

  return (
    <Modal 
      animationType="slide"
      transparent={true}
      visible={isBottomSheetOpen}
      onRequestClose={handleCloseBottomSheet}
    >
      <View className="flex-1 bg-black/[0.3]">
      
          <KeyboardAvoidingView   
            behavior="padding"
            enabled 
            className="absolute left-0 right-0 bottom-0 bg-white justify-start rounded-t-3xl px-1 py-2 shadow-lg" style={{ height: windowHeight * 0.7 }}
          >

              <View className="flex-row items-center justify-between mx-2">
                  <Text className="text-lg text-slate-400">Comments</Text>
                  <Pressable className="flex-row justify-end" onPress={handleCloseBottomSheet}>
                        <XMarkIcon size={22} color="#9ca3af"/>
                  </Pressable>
              </View>

              <View className="flex-row p-2 w-full space-x-1 items-center">
          
                  <View className="flex-1 flex-row items-center bg-gray-200 rounded-xl p-1">
                      {user && userDetails.profilePictureURL ? (
                          <Image 
                            source={{
                              uri: userDetails.profilePictureURL
                            }}
                            className="w-10 h-10 rounded-full"
                          />
                      ) : (
                          <Image 
                            source={require(`../../assets/tiuser.png`)}
                            className="w-10 h-10 rounded-full"
                          />
                      )}

                      <TextInput 
                        className="flex-1 p-2 bg-gray-200 text-black"
                        placeholder='Comment...'
                        value={newComment}
                        onChangeText={handleCommentChange}
                        multiline
                      />

                      <TouchableOpacity  
                        onPress={() => {
                          if(user){
                            handlePostComment(newComment, bookId, chapterId, userDetails.uid, setNewComment);
                          }else{
                            setLoginWindow(true);
                          }
                        }}
                        className="bg-black rounded-lg ml-2 px-6 py-1"
                      >
                        <PaperAirplaneIcon color="white"/>
                      </TouchableOpacity>
                  </View>

              </View>

             

              <ScrollView className="mt-2">
                {comments.map((comment) => (
                    <CommentSection 
                      key={comment.id}
                      comment={comment}
                      bookId={bookId} 
                      chapterId={chapterId}
                      userDetails={userDetails}
                      setLoginWindow={setLoginWindow}
                      user={user}
                    />
                ))}

                {hasMoreComments && (
                  <TouchableOpacity className="items-center mb-4" onPress={handleLoadMoreComments}>
                    <Text>Load more comments</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            
          </KeyboardAvoidingView>


          {loginWindow && (
            <LoginModal
              onClose={() => setLoginWindow(false)}
            />
          )}
      </View>

    </Modal>
  )
}

export default PullUpMenu