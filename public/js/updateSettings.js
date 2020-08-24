import axios from 'axios';
import { showAlert } from './alert';

//type is either 'password' or user 'data', data is an object with the new data, depending on type
export const updateSettings = async (data, type) => {
  try {
    const url = `http://127.0.0.1:3000/api/v1/users/${type === 'data' ? 'updateMe' : 'updateMyPassword'}`;
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `User ${type === 'password' ? 'password' : 'data'} updated successfully`);
      window.setTimeout(() => {
        // location.assign('/me');
      }, 1300);
    }
  } catch (err) {
    console.log(err.message);
      showAlert('error', err.response.data.message);
  }
};