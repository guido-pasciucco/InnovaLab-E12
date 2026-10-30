import Form from 'react-bootstrap/Form';

function GenericSelect({text, opciones}) {
  return (
    <Form.Select aria-label="Default select example">
      <option>{text}</option>
      {opciones.map((opcion, index) => (
        <option key={index} value={index + 1}>
          {opcion}
        </option>
      ))}
    </Form.Select>
  );
}

export default GenericSelect;