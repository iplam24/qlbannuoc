import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingHorizontal: isIOS ? 20 : 16, // Tăng padding cho iOS
        paddingBottom: 20,
        paddingTop: isIOS ? 0 : StatusBar.currentHeight,
    },
    categories: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 10,
        flexWrap: 'nowrap',
        paddingBottom: 10,
        paddingHorizontal: isIOS ? 0 : 0, // Điều chỉnh nếu cần
    },
    categoryBadge: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f8ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 10,
        ...(isIOS && {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        }),
    },
    featuredCardItem: {
        width: width * 0.45,
        backgroundColor: '#1f6f8b',
        borderRadius: 20,
        padding: 10,
        position: 'relative',
        marginRight: 10,
        marginLeft: isIOS ? 5 : 0, // Thêm margin trái cho iOS
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
            },
            android: {
                elevation: 5,
            },
        }),
        marginTop: 5,
    },
    section: {
        marginTop: 30,
        paddingHorizontal: isIOS ? 0 : 0, // Điều chỉnh nếu cần
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: isIOS ? 5 : 0, // Căn chỉnh header
    },
    drinkCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        marginHorizontal: isIOS ? 2 : 0, // Cân bằng hai bên
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 25,
        borderColor: '#e0e0e0',
        position: 'relative',
        height: 80,
        marginHorizontal: isIOS ? 15 : 0, // Thêm margin hai bên cho iOS
        paddingHorizontal: isIOS ? 10 : 0,
    },
    // Giữ nguyên các style khác không cần thay đổi
    categoryText: {
        color: '#1f6f8b',
        fontSize: 14,
    },
    featuredImage: {
        width: '100%',
        height: 180,
        borderRadius: 15,
    },
    heartButton: {
        position: 'absolute',
        top: 14,
        right: 14,
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: 6,
        borderRadius: 20,
    },
    featuredTextContainer: {
        position: 'absolute',
        bottom: 14,
        left: 14,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        padding: 8,
        borderRadius: 8,
    },
    featuredTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    featuredSub: {
        color: 'white',
        fontSize: 13,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f6f8b',
        margin: 5,
    },
    seeAll: {
        fontSize: 14,
        color: 'green',
        textDecorationLine: 'underline',
    },
    drinkImage: {
        width: 55,
        height: 55,
        borderRadius: 12,
        marginRight: 12,
    },
    drinkInfo: {
        flex: 1,
    },
    drinkName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f6f8b',
    },
    drinkSub: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    drinkPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f6f8b',
        marginTop: 5,
    },
    vnd: {
        fontSize: 12,
        fontWeight: '400',
        color: '#999',
        fontFamily: 'sans-serif',
        fontStyle: 'italic',
        position: 'relative',
        top: -3,
    },
    orderButton: {
        backgroundColor: '#e0f7fa',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    orderText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 13,
    },
    footerItem: {
        alignItems: 'center',
    },
    footerLabel: {
        fontSize: 12,
        color: '#1f6f8b',
    },
    searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginTop: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    marginBottom:10
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },
});