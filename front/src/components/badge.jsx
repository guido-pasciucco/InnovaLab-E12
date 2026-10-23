import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

function SelectedBadge(bg, text) {
  return (
    <Stack direction="horizontal" gap={2}>
      <Badge pill bg={bg} text={text}>
        {bg.charAt(0).toUpperCase() + bg.slice(1)}
      </Badge>
      {/* <Badge pill bg="secondary">
        Secondary
      </Badge>
      <Badge pill bg="success">
        Success
      </Badge>
      <Badge pill bg="danger">
        Danger
      </Badge>
      <Badge pill bg="warning" text="dark">
        Warning
      </Badge>
      <Badge pill bg="info">
        Info
      </Badge>
      <Badge pill bg="light" text="dark">
        Light
      </Badge>
      <Badge pill bg="dark">
        Dark
      </Badge> */}
    </Stack>
  );
}

export default SelectedBadge;