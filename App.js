import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  function getUserInfo(token) {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: token,
        parameters: {
          fields: {string: 'email, name'},
        },
      },
      getUserCallback,
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  }

  function getUserCallback(error, result) {
    if (error) {
      return Alert.alert('GetUserError', error);
    }

    setLoading(false);
    setUser(result);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <View style={styles.content}>
        {loading && <ActivityIndicator />}
        {user && (
          <>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </>
        )}
      </View>

      <LoginButton
        permissions={['public_profile', 'email']}
        onLoginFinished={async (err, res) => {
          if (err) {
            return Alert.alert('Error', 'Error: ' + err);
          }
          if (res.isCancelled) {
            return Alert.alert('Acesso negado', 'acesso negado pelo usuario');
          }

          const accessData = await AccessToken.getCurrentAccessToken();
          setLoading(true);
          getUserInfo(accessData.accessToken);
        }}
        onLogoutFinished={() => {
          setUser({});
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  userEmail: {
    color: '#888',
    // fontSize: 16,
  },
});
