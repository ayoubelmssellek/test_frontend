import { createStore } from 'redux';  // ✅ تصحيح الاستيراد
import rootReducer from './CompaineReducers';  // ✅ تصحيح الاستيراد

const store = createStore(rootReducer);

export default store;
