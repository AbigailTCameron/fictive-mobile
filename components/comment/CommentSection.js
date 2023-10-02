import { View, Text, Image, Pressable, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react';
import { formatTimestamp } from '../queries/format';
import {EllipsisVerticalIcon} from 'react-native-heroicons/outline';
import { fetchReplies } from '../queries/fetchUserDetails';
import Replies from './Replies';
import ReplyDeleteModal from '../modals/ReplyDeleteModal';
import ReplyInputModal from '../modals/ReplyInputModal';


const CommentSection = ({comment, bookId, chapterId, userDetails, user, setLoginWindow}) => {
  const [showReplySection, setShowReplySection] = useState(false);
  const [replies, setReplies] = useState([]);
  const [batchReplySize, setReplyBatchSize] = useState(10); 

  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [showReplies, setShowReplies] = useState(false);

  const [options, setOptions] = useState(false);


  useEffect(() => {
    fetchReplies(bookId, chapterId, comment.id, setReplies, batchReplySize, setHasMoreReplies); 
  }, [bookId, chapterId, comment.id, batchReplySize]); 

  const handleLoadMoreReplies = () => {
    setReplyBatchSize((prevBatchSize) => prevBatchSize + 10);
  };

  return (
    <Pressable className="flex-1 w-full px-2 py-4">

        <View className="flex-row flex-1 space-x-2 my-2">

      
              {comment.user.profilePictureURL ? (
                <Image 
                  source={{
                    uri: comment.user.profilePictureURL
                  }}
                  className="w-8 h-8 rounded-full" 
                />
              ):(
                <Image 
                  source={require(`../../assets/tiuser.png`)}
                  className="w-8 h-8 rounded-full" 
                />
              )}
      


            <TouchableOpacity className="flex-1 relative">
                <View className="flex-row items-center space-x-1 justify-between">
                  <Text className="text-xs text-gray-500">{comment.user.firstName} {comment.user.lastName}</Text>
        
                  <Text className="text-xs text-gray-500">
                    {comment.timestamp && formatTimestamp(comment.timestamp)}
                  </Text>
                </View>

                <View>
                  <Text className="text-black font-semibold text-justify">
                    {comment.content}
                  </Text>
                </View>

            </TouchableOpacity>
            
            {userDetails && (
              <Pressable
              onPress={() => {
                setOptions(!options);
              }} 
              >
                <EllipsisVerticalIcon size={20} color="black"/>
              </Pressable>
            )}

        </View>


        {replies.length > 0 && !showReplies && (
          <TouchableOpacity 
            onPress={() => setShowReplies(!showReplies)}
            className="items-center">
            <Text className="font-medium">
              {replies.length} replies
            </Text>
          </TouchableOpacity>
        )}

        {showReplies && (
          <ScrollView className="mt-2">
            {replies.map((reply) => (
              <Replies 
                key={reply.id}
                bookId={bookId}
                chapterId={chapterId}
                commentId={comment.id}
                userDetails={userDetails}
                reply={reply} 
                user={user}
              />
            ))}

            {hasMoreReplies && (
              <TouchableOpacity className="items-center" onPress={handleLoadMoreReplies}>
                <Text>
                  Load more
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}       
       
        {options && (
          <ReplyDeleteModal 
            onClose={() => setOptions(false)} 
            userDetails={userDetails} 
            comment={comment.content} 
            commenter={comment.userId}
            bookId={bookId}
            chapterId={chapterId} 
            commentId={comment.id}
            handleReply={() => {
              setShowReplySection(true);
              setOptions(false);
            }}
          />
        )}

        {showReplySection && (
          <ReplyInputModal
            user={user}
            onClose={() => setShowReplySection(false)}
            userDetails={userDetails}
            comment={comment.content}
            username={comment.user.username}
            bookId={bookId}
            chapterId={chapterId}
            commentId={comment.id}
          />
        )}

        
    


    </Pressable>
  )
}

export default CommentSection