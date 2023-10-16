import {
  Paper,
  TextInput,
  Button,
  Group,
  SimpleGrid,
  Text,
  Image,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { DateInput } from '@mantine/dates';
import classes from './InputForm.module.css';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconCloudUpload } from '@tabler/icons-react';

import { useDispatch, useSelector } from 'react-redux';
import { updateUserData, updateUserDataField } from './userSlice.js';

export function UserInputForm() {
  const dispatch = useDispatch();

  const userAuth = useSelector((state) => state.auth.user) ?? {};

  const localUserData = useSelector((state) => state.user.userData);
  //   const isLoading = useSelector((state) => state.user.isLoading);
  //   const error = useSelector((state) => state.user.error);
  const openRef = useRef(null);
  const [file, setFile] = useState([]); //avatarURL
  console.log(file);
  const [imageUrl, setImageUrl] = useState(''); // Стан для URL превью зображен
  console.log(imageUrl);

  const [formChange, setFormChange] = useState(false);

  const handleDropavatarURL = (droppedFiles) => {
    if (droppedFiles.length > 0) {
      const lastFile = droppedFiles[droppedFiles.length - 1]; // берем останній в масиві
      const url = URL.createObjectURL(lastFile); //створюємо тимчасове посилання
      setImageUrl(url); // Зберегти URL зображення в стані
      setFile(droppedFiles);
      setFormChange(true);
      // dispatch(updateUserData({avatarURL: droppedFiles}))
      console.log(userAuth);
    }
  };
  const handleInputChange = (e) => {
    console.log('e.target:', e.target);
    const { name, value } = e.target;
    // console.log('name', name);
    // console.log('value:', value);
    dispatch(updateUserDataField({ field: name, value: value.trim() }));
    setFormChange(true);
    console.log(localUserData);
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? date.toDateString() : '';
    dispatch(
      updateUserDataField({ field: 'birthday', value: formattedDate}),
    );
    setFormChange(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('натиснули кнопку відправити');
    console.log(file);
    const formData = new FormData();
    formData.append('username', localUserData.username);
    formData.append('birthday', localUserData.birthday);
    formData.append('email', localUserData.email);
    formData.append('phone', localUserData.phone);
    formData.append('skype', localUserData.skype);
    if (file.length > 0) {
      formData.append('avatarURL', file[0]);
    }
    dispatch(updateUserData(formData))
      .then(() => {
        console.log('Запит на оновлення даних виконано успішно');
      })
      .catch((error) => {
        console.error('Помилка під час відправки PATCH-запиту:', error);
      });
    setFormChange(false);
  };

  const dateBirthday = userAuth?.birthday;
  const dateBirthdayLocal = localUserData?.birthday
  // const parseDateBirthday = new Date(dateBirthday);
  const parseDateBirthday = dateBirthday ? new Date(dateBirthday) : null;
  const parseDateBirthdayLocal = dateBirthday ? new Date(dateBirthdayLocal) : null;
  console.log('parseDateBirthday:', parseDateBirthday);
  console.log('typeof parseDateBirthday:', typeof parseDateBirthday);

  useEffect(() => {
    const inputFieldNames = ['username', 'email', 'phone', 'skype'];

    inputFieldNames.forEach((fieldName) => {
      const input = document.querySelector(`input[name="${fieldName}"]`);
      if (input) {
        input.value = userAuth[fieldName] || '';
      }
    });
  }, [userAuth]);

  return (
    <Paper shadow="md" radius="lg">
      <div className={classes.wrapper}>
        {/* <div className={classes.wrapper}> */}
        <form
          className={classes.form}
          onSubmit={handleFormSubmit}
          onChange={handleInputChange}
        >
          <div className={classes.wrapperDropzone}>
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              onDrop={handleDropavatarURL}
              openRef={openRef}
              className={classes.dropzone}
              radius="md"
            >
              {userAuth?.avatarURL !== ' ' && imageUrl === '' ? (
                <SimpleGrid className={classes.avatarURL}>
                  <Image
                    src={userAuth?.avatarURL} // Використовувати URL зображення із локального стану
                    onLoad={() => URL.revokeObjectURL(imageUrl)}
                  />
                </SimpleGrid>
              ) : file.length === 0 ? (
                <div style={{ pointerEvents: 'none' }}>
                  <Group justify="center">
                    <Dropzone.Idle>
                      <IconCloudUpload stroke={1.5} className={classes.icon} />
                    </Dropzone.Idle>
                  </Group>
                </div>
              ) : (
                <SimpleGrid className={classes.avatarURL}>
                  <Image
                    src={imageUrl} // Використовувати URL зображення із локального стану
                    onLoad={() => URL.revokeObjectURL(imageUrl)}
                  />
                </SimpleGrid>
              )}
            </Dropzone>
            <Text ta="center" className={classes.textusername}>
              {userAuth?.username}
            </Text>
            <Text ta="center" className={classes.textUser}>
              User
            </Text>
          </div>

          <div className={classes.fields}>
            <SimpleGrid cols={{ base: 1, xl: 2 }}>
              <TextInput
                name="username"
                label="User Name"
                placeholder="Enter your name"
                required
                maxLength={16}
                className={classes.input}
                defaultValue={userAuth?.username}
                onChange={handleInputChange}
              />
              <DateInput
                name="birthday"
                valueFormat="YYYY/MM/DD"
                label="Birthday"
                placeholder="select your date of birth"
                value={parseDateBirthdayLocal || parseDateBirthday}
                // value={localUserData?.birthday}
                // defaultValue={parseDateBirthday}
                onChange={handleDateChange}
                // onChange={handleInputChange}
              />
              <TextInput
                name="email"
                label="Email"
                placeholder="Enter your email"
                required
                defaultValue={userAuth?.email}
                onChange={handleInputChange}
              />
              <TextInput
                name="phone"
                // colSpan={2}
                label="Phone"
                placeholder="38 (097) 123 45 67"
                defaultValue={userAuth?.phone}
                onChange={handleInputChange}
              />
              <TextInput
                name="skype"
                // colSpan={2}
                label="Skype"
                placeholder="Add a skype number"
                maxLength={16}
                defaultValue={userAuth?.skype}
                onChange={handleInputChange}
              />
            </SimpleGrid>

            <Group justify="center" mt="md">
              <Button
                type="submit"
                className={classes.control}
                disabled={!formChange}
              >
                Save changes
              </Button>
            </Group>
          </div>
        </form>
      </div>
    </Paper>
  );
}

// /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

// Account.page
// import Account from "../modules/Account/index.js"
// function AccountPage() {
//   return <div><Account/></div>;
// }

// export default AccountPage;
