import { Paper, TextInput, Button, Group, SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import { DateInput } from '@mantine/dates';
import classes from './InputForm.module.css';

export function UserInputForm() {
  const [value, setValue] = useState(null);
  return (
    <Paper shadow="md" radius="lg">
      <div className={classes.wrapper}>
        <form
          className={classes.form}
          onSubmit={(event) => event.preventDefault()}
        >
          <div className={classes.fields}>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label="User Name"
                placeholder="Enter your name"
                required
                maxLength={16}
                className={classes.input}
              />
              <DateInput
                valueFormat="YYYY/MM/DD"
                value={value}
                onChange={setValue}
                label="Birthday"
                placeholder="select your date of birth"
              />
              <TextInput
                label="Email"
                placeholder="Enter your email"
                required
              />
              <TextInput
                colSpan={2}
                label="Phone"
                placeholder="38 (097) 123 45 67"
              />
              <TextInput
                colSpan={2}
                label="Skype"
                placeholder="Add a skype number"
                maxLength={16}
              />
            </SimpleGrid>

            <Group justify="center" mt="md">
              <Button type="submit" className={classes.control}>
                Save changes
              </Button>
            </Group>
          </div>
        </form>
      </div>
    </Paper>
  );
}
