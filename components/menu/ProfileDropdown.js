import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';

const ProfileDropdown = ({ isVisible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: 'white',
              width: '80%', // Adjust the width as needed
              maxHeight: 200, // Set the maximum height of the dropdown
              borderRadius: 10,
              padding: 16,
              elevation: 5,
              marginBottom: 16,
            }}
          >
            <TouchableOpacity onPress={() => console.log('Option 1 clicked')}>
              <Text>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Option 2 clicked')}>
              <Text>Option 2</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ProfileDropdown;
