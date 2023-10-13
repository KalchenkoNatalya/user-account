import { useRef, useState } from 'react';
import { Text, Group, Image, SimpleGrid } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconCloudUpload } from '@tabler/icons-react';
import classes from './DropzoneButton.module.css';

export function DropzoneButton() {
  const openRef = useRef(null);
  const [files, setFiles] = useState([]);
  console.log(files);
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    );
  });
  return (
    <div className={classes.wrapper}>
      <Dropzone
        accept={IMAGE_MIME_TYPE.jpg}
        onDrop={setFiles}
        openRef={openRef}
        // onDrop={() => {}}
        className={classes.dropzone}
        radius="md"
        // accept={[MIME_TYPES.jpg]}
        // maxSize={30 * 1024 ** 2}
      >
        {files.length === 0 ? (
          <div style={{ pointerEvents: 'none' }}>
            <Group justify="center">
              <Dropzone.Idle>
                <IconCloudUpload stroke={1.5} className={classes.icon} />
              </Dropzone.Idle>
            </Group>
          </div>
        ) : (
          <SimpleGrid className={classes.avatar}>{previews}</SimpleGrid>
        )}
      </Dropzone>

      <Text ta="center" className={classes.textUsername}>
        User Name
      </Text>
      <Text ta="center" className={classes.textUser}>
        User
      </Text>
    </div>
  );
}
