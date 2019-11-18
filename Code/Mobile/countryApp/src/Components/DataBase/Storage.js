import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

const LocalStorage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
    sync: {}
});

export { LocalStorage };
