import { useState, useCallback } from "react";
import { Container, Form, SubmitButton } from "./styles";
import { FaGithub, FaPlus } from "react-icons/fa";
import axios from "axios";

export function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRespositorios] = useState([]);

  function handleInputChange(e) {
    setNewRepo(e.target.value);
    console.log(newRepo);
  }

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        axios
          .get(`https://api.github.com/repos/${newRepo}`)
          .then((response) => {
            const data = {
              name: response.data.full_name,
            };

            [...repositorios, data];
            setNewRepo("");
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
      submit();
    },
    [newRepo, repositorios]
  );

  return (
    <Container>
      <FaGithub size={25} />
      <h1>Meus Repositorios</h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Adicionar Repositorios"
          value={newRepo}
          onChange={handleInputChange}
        />

        <SubmitButton>
          <FaPlus color="#FFF" size={14} />
        </SubmitButton>
      </Form>
    </Container>
  );
}
