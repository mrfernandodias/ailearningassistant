import { handleApiError } from '../utils/apiHelpers';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';

const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD);
    return response.data;
  } catch (error) {
    handleApiError(error, 'getDashboardData');
  }
};

const progressService = {
  getDashboardData,
};

export default progressService;
