import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    };
    loadNotes();
  }, []);

  const saveNote = async () => {
    if (!note.trim()) return; // Prevent saving empty notes
    const newNotes = [...notes, note.trim()];
    setNotes(newNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    setNote('');
  };

  const deleteNote = async (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Enter note"
        style={styles.input}
      />
      <Button title="Save Note" onPress={saveNote} />
      <FlatList
        data={notes}
        renderItem={({ item, index }) => (
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{item}</Text>
            <TouchableOpacity onPress={() => deleteNote(index)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 100,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  noteText: {
    flex: 1,
  },
  deleteText: {
    color: 'red',
  },
});

export default App;