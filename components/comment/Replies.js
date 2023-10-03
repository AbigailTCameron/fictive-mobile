import { View, Text, Image, Pressable, Appearance } from 'react-native'
import React, { useState } from 'react';
import { formatTimestamp } from '../queries/format';
import {EllipsisVerticalIcon} from 'react-native-heroicons/outline';
import ReplyModal from '../modals/ReplyModal';
import ReplyInputModal from '../modals/ReplyInputModal';


const Replies = ({bookId, chapterId, commentId, userDetails, reply, user}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const [replyOptions, setReplyOptions] = useState(false);
  const [showReplySection, setShowReplySection] = useState(false);

  return (
    <View className="flex-1 w-full px-2 py-2">
        <View className="flex-row space-x-2 flex-1 ml-8 my-2">

           
              {reply.user.profilePictureURL ? (
                <Image 
                  source={{
                    uri: reply.user.profilePictureURL
                  }}
                  className="w-6 h-6 rounded-full" 
                />
              ) : (
                <Image 
                  source={require(`../../assets/tiuser.png`)}
                  className="w-6 h-6 rounded-full"
                />
              )}
          
            
            <View className="flex-1 relative">

                <View className="flex-row space-x-1 items-center justify-between">
                      <Text className="text-xs text-gray-500">{reply.user.firstName} {reply.user.lastName}</Text>
                      
                      <Text className="text-xs text-gray-500">
                        {reply.timestamp && formatTimestamp(reply.timestamp)} 
                      </Text>
                </View>
                
                <View className="mt-1">
                  <Text className={`${isDarkTheme ? 'text-white' : 'text-black'} font-medium text-justify`}>
                    {reply.content}
                  </Text>
                </View>

            </View>

            {userDetails && (
              <Pressable
              onPress={() => {
                setReplyOptions(!replyOptions);
              }} 
              >
                <EllipsisVerticalIcon size={20} color={`${isDarkTheme ? 'white' : 'black'}`}/>
              </Pressable>
            )}
          
        </View>

        {replyOptions && (
          <ReplyModal 
            onClose={() => setReplyOptions(false)} 
            reply={reply.content}
            replier={reply.userId}
            bookId={bookId}
            chapterId={chapterId}
            commentId={commentId}
            replyId={reply.id}
            userDetails={userDetails}
            handleReply={() => {
              setShowReplySection(true);
              setReplyOptions(false);
            }}
            
          />
        )}

        {showReplySection && (
          <ReplyInputModal 
            user={user}
            onClose={() => setShowReplySection(false)}
            userDetails={userDetails}
            comment={reply.content}
            username={reply.user.username}
            bookId={bookId}
            chapterId={chapterId}
            commentId={commentId}
          />
        )}

        
    </View>
  )
}

export default Replies