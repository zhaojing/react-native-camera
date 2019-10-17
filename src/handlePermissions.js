import { PermissionsAndroid, Platform } from 'react-native';

export const requestPermissions = async (
  hasVideoAndAudio,
  CameraManager,
  permissionDialogTitle,
  permissionDialogMessage,
) => {
  if (Platform.OS === 'ios') {
    let check = hasVideoAndAudio
      ? CameraManager.checkDeviceAuthorizationStatus
      : CameraManager.checkVideoAuthorizationStatus;

    if (check) return await check();
  } else if (Platform.OS === 'android') {
    const alreadGrented = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (!hasVideoAndAudio) {
      return alreadGrented === PermissionsAndroid.RESULTS.GRANTED || alreadGrented === true;
    }
    const alreadGrentedRecord = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    if (alreadGrentedRecord) {
      return alreadGrentedRecord
    } else {
      let params = undefined;
      if (permissionDialogTitle || permissionDialogMessage)
        params = { title: permissionDialogTitle, message: permissionDialogMessage };
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, params);
      if (!hasVideoAndAudio)
        return granted === PermissionsAndroid.RESULTS.GRANTED || granted === true;
      const grantedAudio = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        params,
      );
      return (
        (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) &&
        (grantedAudio === PermissionsAndroid.RESULTS.GRANTED || grantedAudio === true)
      );
    }
  }
  return true;
};
