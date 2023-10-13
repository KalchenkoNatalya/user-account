import { UserInputForm } from './InputForm';
import { DropzoneButton } from './DropzoneButton';
import classes from './InputForm.module.css';

function UserForm() {
  console.log('UserForm is working');
  return (
    <div className={classes.userWrapper}>
      <DropzoneButton />
      <UserInputForm />
    </div>
  );
}

export default UserForm;
