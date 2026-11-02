import Form from 'react-bootstrap/Form';

function GenericSelect({text, opciones, onChange}) {
  return (
    <Form.Select aria-label="Default select example" onChange={onChange}>
      <option>{text}</option>
      {opciones.map((opcion, index) => (
        <option key={index} value={opcion}>
          {opcion}
        </option>
      ))}
    </Form.Select>
  );
}

export default GenericSelect;