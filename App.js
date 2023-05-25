import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { theme } from "./colors.js";

const STORAGE_KEY = "@toDos";
const WORKING_KEY = "@working";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadCurrentTab();
    loadToDos();
  }, []);

  const work = async () => {
    setWorking(true);
    await saveCurrentTab(true);
  };
  const travel = async () => {
    setWorking(false);
    await saveCurrentTab(false);
  };
  const onChangeText = (e) => setText(e);
  const saveCurrentTab = async (currentTab) => {
    await AsyncStorage.setItem(WORKING_KEY, JSON.stringify(currentTab));
  };
  const loadCurrentTab = async () => {
    const currentTab = await AsyncStorage.getItem(WORKING_KEY);
    currentTab !== null ? setWorking(JSON.parse(currentTab)) : null;
  };
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    s !== null ? setToDos(JSON.parse(s)) : null;
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    //const newToDos = Object.assign({}, toDos, {[Date.now()] : {text, work:working}})
    const newToDo = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDo);
    await saveToDos(newToDo);
    setText("");
  };
  const agreeToDelete = async (id) => {
    const newToDos = { ...toDos };
    delete newToDos[id];
    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  const deleteToDo = (id) => {
    Alert.alert("Delete To Do", "", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => agreeToDelete(id),
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          onSubmitEditing={addToDo}
          returnKeyType="done"
          placeholder={working ? "What's your plan?" : "Where do you wanna go?"}
          value={text}
        />
      </View>
      <ScrollView contentContainerStyle={{ color: "red" }}>
        {/* {Object.keys(toDos).length === 0 ? (
          <View></View>
        ) : (
          Object.entries(toDos).map((toDo, idx) => {
            console.log();
            return (
              <View key={idx} style={styles.toDo}>
                <Text style={styles.toDoText}>{toDo[1].text}</Text>
              </View>
            );
          })
        )} */}
        {Object.keys(toDos).map((key, idx) => {
          return toDos[key].working === working ? (
            <View key={idx} style={styles.toDo}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name="trash" size={18} color={theme.toDoBg} />
              </TouchableOpacity>
            </View>
          ) : null;
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 44,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    fontSize: 16,
    color: "white",
    fontWeight: 500,
  },
});
