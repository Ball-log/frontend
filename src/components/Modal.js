import React from 'react';
import { Modal, View, Text, Pressable, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const ModalComponent = ({
  isVisible,
  onClose,
  onModify,
  onDelete,
  position,
}) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.modalOverlay, position]}>
          <TouchableWithoutFeedback>
            <View style={styles.miniModalContainer}>
              <View style={styles.miniModalContent}>
                <View style={styles.miniModalButtons}>
                  <Pressable style={styles.miniModalButton} onPress={onModify}>
                    <View style={styles.miniModalFixButton}>
                      <Text style={styles.miniModalButtonText}>수정</Text>
                      <MaterialCommunityIcons name="pencil-outline" size={13} color="black" />
                    </View>
                  </Pressable>
                  <Pressable style={styles.miniModalButton} onPress={onDelete}>
                    <View style={styles.miniModalFixButton}>
                      <Text style={styles.miniModalButtonText}>삭제</Text>
                      <Feather name="trash-2" size={13} color="black" />
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalOverlay:{
        flex: 1,
      },
      miniModalContainer: {
        flex: 1,
        position: 'absolute',
        top: 420,
        right: 0,
      },
      miniModalContent: {
        borderColor: '#D9D9D9',
        borderWidth: 1,
        backgroundColor: '#f8f8f8',
        width: 146,
        height: 29,
        alignItems: 'center',
      },
      miniModalButtons: {
        flexDirection: 'row',
      },
      miniModalButton: {
        width: 55,
        height: 19,
        borderRadius: 44,
        margin: 5,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
      },
      miniModalFixButton: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      miniModalButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000000',
      },
});

export default ModalComponent;
