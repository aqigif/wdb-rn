import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import withObservables from '@nozbe/with-observables';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {ScrollView} from 'react-native-gesture-handler';

const TodoList = props => {
  const [text, setText] = useState('');
  const {database} = props;

  const actionAdd = async () => {
    if (text === '') {
      return;
    }
    await props.database.action(async () => {
      await database.collections.get('posts').create(post => {
        post.title = 'New post';
        post.body = text;
      });
      setText('');
    });
  };

  const actionDelete = post => async () => {
    await database.action(async () => {
      await post.destroyPermanently();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerList}>
        <ScrollView>
          {props.posts.map((post, i) => (
            <View key={i} style={styles.todoItem}>
              {/* <Text>{post.title}</Text> */}
              <Text>{post.body}</Text>
              <Text onPress={actionDelete(post)} style={styles.buttonDelete}>
                delete
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.containerInput}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={value => setText(value)}
        />
        <TouchableOpacity style={styles.buttonAdd} onPress={actionAdd}>
          <Text style={styles.textButton}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TodoListContainer = withDatabase(
  withObservables([], ({database}) => ({
    posts: database.collections
      .get('posts')
      .query()
      .observe(),
  }))(TodoList),
);

export default TodoListContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    margin: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: 'grey',
  },
  buttonAdd: {
    margin: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
  textButton: {
    color: 'white',
  },
  containerList: {
    margin: 5,
    flex: 1,
  },
  todoItem: {
    margin: 2,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonDelete: {
    color: 'red',
  },
});
