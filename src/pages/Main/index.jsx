import { useState, useCallback, useEffect } from "react";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import axios from "axios";

export function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRespositorios] = useState([]);
  const [loaging, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Buscar;
  useEffect(() => {
    const reposi = localStorage.getItem("repos");
    if (reposi) {
      setRespositorios(JSON.parse(reposi));
      console.log(reposi, "local");
    }
  }, []);

  // Salvar alterações
  useEffect(() => {
    localStorage.setItem("repos", JSON.stringify(repositorios));
  }, [repositorios]);

  function handleInputChange(e) {
    setNewRepo(e.target.value);
    setAlert(null);
  }

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        axios
          .get(`https://api.github.com/repos/${newRepo}`)
          .then((response) => {
            const hasRepo = repositorios.find((r) => r.name === newRepo);
            if (hasRepo) {
              throw new Error("Repositorio duplicado");
            }
            const data = {
              name: response.data.full_name,
            };

            setRespositorios([...repositorios, data]);
            setNewRepo("");
          })
          .catch((error) => {
            setAlert(true);
          })
          .finally(() => {
            setLoading(false);
            if (newRepo == "") {
              throw new Error("voce precisa digitar um repositorio");
            }
          });
      }
      submit();
    },
    [newRepo, repositorios]
  );

  const handleDelete = useCallback(
    (repo) => {
      const find = repositorios.filter((r) => {
        return r.name !== repo;
      });
      setRespositorios(find);
    },
    [repositorios]
  );

  return (
    <Container>
      <FaGithub size={25} />
      <h1>Meus Repositorios</h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          placeholder="Adicionar Repositorios"
          value={newRepo}
          onChange={handleInputChange}
        />

        <SubmitButton loaging={loaging ? 1 : 0}>
          {loaging ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repositorios.map((repo) => (
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repo.name}
            </span>
            <a href="#">
              <FaBars size={20} />
            </a>
          </li>
        ))}
      </List>
    </Container>
  );
}
