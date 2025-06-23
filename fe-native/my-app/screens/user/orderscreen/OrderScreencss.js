import { StyleSheet, Platform, StatusBar } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    marginTop:50
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#1f6f8b', 
    marginVertical: 12,
    marginTop: Platform.OS === 'ios' ? 16 : 8
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#1f6f8b',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addText: { 
    color: 'white', 
    marginLeft: 8, 
    fontSize: 16, 
    fontWeight: '600' 
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  name: { 
    fontSize: 16, 
    fontWeight: '600',
    color: '#333'
  },
  price: { 
    color: '#888', 
    marginTop: 4,
    fontSize: 14 
  },
  iconBtn: { 
    padding: 8,
    marginLeft: 4 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: '#00000099',
    paddingTop: Platform.OS === 'ios' ? 20 : 0
  },
  modalContent: { 
    backgroundColor: '#fff', 
    margin: 20, 
    borderRadius: 12, 
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16,
    color: '#1f6f8b'
  },
  input: {
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8,
    padding: 12, 
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa'
  },
  modalActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 20
  },
  saveBtn: { 
    backgroundColor: '#1f6f8b', 
    padding: 12, 
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center'
  },
  cancelBtn: { 
    backgroundColor: '#f0f0f0', 
    padding: 12, 
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center'
  },
  saveText: { 
    color: 'white', 
    fontWeight: '600',
    fontSize: 16
  },
  cancelText: { 
    color: '#666', 
    fontWeight: '600',
    fontSize: 16
  },
  selectImageBtn: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  selectImageText: {
    color: '#1f6f8b',
    fontSize: 16,
    fontWeight: '500'
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'contain'
  },
  noImageText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 10,
    fontStyle: 'italic'
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    fontSize: 16, // Tăng kích thước chữ
    color: '#333', // Màu chữ đậm hơn
  },
  searchInputFocused: {
    borderColor: '#1f6f8b', // Màu viền khi focus
    shadowOpacity: 0.2,
    elevation: 3,
  },
  searchInputPlaceholder: {
    color: '#888', // Màu placeholder nhạt hơn
    fontSize: 16,
  }
});