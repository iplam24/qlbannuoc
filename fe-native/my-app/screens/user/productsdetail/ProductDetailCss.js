import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  goBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goBackText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  container: {
    padding: 16,
    paddingBottom: 80,
    backgroundColor: '#f9f9f9',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    color: '#e91e63',
    marginBottom: 8,
  },
  vnd: {
    fontSize: 14,
    color: '#555',
  },
  productDescription: {
    fontSize: 16,
    color: '#444',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingStars: {
    fontSize: 16,
    color: '#f39c12',
  },
  similarTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  similarProductCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 12,
    width: 140,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  similarProductImage: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    marginBottom: 6,
  },
  similarProductName: {
    fontSize: 14,
    fontWeight: '500',
  },
  similarProductPrice: {
    fontSize: 14,
    color: '#e91e63',
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1f6f8b',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 13,
  },
});