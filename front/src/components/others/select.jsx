import Form from 'react-bootstrap/Form';

function GenericSelect({text, opciones, onChange, name, id, value, required}) {
  return (
    <Form.Select 
      aria-label="Default select example" 
      name={name}       
      id={id}           
      className="form-control"
      value={value}     
      onChange={onChange} 
      required={required}   
    >
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