import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface ScoreModalProps {
    visible: boolean;
    title: string;
    score: number;
    onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const ScoreModal: React.FC<ScoreModalProps> = ({ visible, title, score, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.splash}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.score}>{score}</Text>
                    <TouchableOpacity style={styles.okButton} onPress={onClose}>
                        <Text style={styles.okText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        width,
        height,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        elevation: 8,
        minWidth: 250,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    score: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#4caf50',
        marginBottom: 24,
    },
    okButton: {
        backgroundColor: '#2196f3',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 32,
    },
    okText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ScoreModal;