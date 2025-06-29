import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff', padding: 16
  },
  title: {
    fontSize: 22, fontWeight: 'bold', marginBottom: 12
  },
  card: {
    backgroundColor: '#f9fafb', padding: 12, marginBottom: 10, borderRadius: 8,
    borderLeftWidth: 4
  },
  unread: {
    borderLeftColor: '#3b82f6',
  },
  read: {
    borderLeftColor: '#9ca3af',
  },
  message: {
    fontSize: 16
  },
  time: {
    color: '#6b7280', fontSize: 13, marginTop: 4
  },
  actions: {
    flexDirection: 'row', marginTop: 10
  },
  iconBtn: {
    marginRight: 10
  }
});
